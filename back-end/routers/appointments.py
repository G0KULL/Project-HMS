from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import schemas, crud, models
from database import get_db
from auths import get_current_user
from datetime import datetime
import json

# Canonical status codes and display labels
STATUS_FLOW = [
    ("LOUNGE", "On Lounge"),
    ("OPTOMETRY", "At Optometry"),
    ("CONSULTATION", "At Consultation"),
    ("PHARMACY", "At Pharmacy"),
    ("COMPLETED", "Completed"),
]

STATUS_CODE_BY_LABEL = {label.lower(): code for code, label in STATUS_FLOW}
STATUS_LABEL_BY_CODE = {code: label for code, label in STATUS_FLOW}

router = APIRouter(prefix="/appointments", tags=["Appointments"])


# ✅ Create Appointment
@router.post("/", response_model=schemas.Appointment)
def create_appointment_api(
    appointment: schemas.AppointmentCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # attach company_id to appointment (super important)
    if not appointment.company_id:
        appointment.company_id = current_user.company_id
    return crud.create_appointment(db, appointment)


# ✅ Get All Appointments with Role-Based Filtering
@router.get("/")
def list_appointments(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Get appointments based on user role:
    - super_admin: sees ALL appointments from ALL companies
    - doctor: sees only THEIR appointments
    - others (admin, staff): sees their COMPANY's appointments
    """
    
    if current_user.user_type == "super_admin":
        # Super admin sees everything
        return crud.get_appointments(db, skip=skip, limit=limit)
    
    elif current_user.user_type == "doctor":
        # ✅ Doctor sees only their own appointments
        # First, find the doctor record for this user
        doctor = db.query(models.Doctor).filter(
            models.Doctor.user_id == current_user.id
        ).first()
        
        if not doctor:
            return []  # No doctor record found, return empty
        
        # Get appointments assigned to this doctor
        return crud.get_appointments_by_doctor(db, doctor_id=doctor.id, skip=skip, limit=limit)
    
    else:
        # All other users see their company's appointments
        return crud.get_appointments_by_company(
            db, company_id=current_user.company_id, skip=skip, limit=limit
        )


# ✅ Get Single Appointment
@router.get("/{appointment_id}")
def get_appointment(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    appointment = crud.get_appointment_by_id(db, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    # ✅ Authorization checks
    if current_user.user_type == "super_admin":
        # Super admin can see everything
        pass
    elif current_user.user_type == "doctor":
        # Doctor can only see their own appointments
        doctor = db.query(models.Doctor).filter(
            models.Doctor.user_id == current_user.id
        ).first()
        if not doctor or appointment.doctor_id != doctor.id:
            raise HTTPException(status_code=403, detail="Not authorized to access this appointment")
    else:
        # Others can only see their company's appointments
        if appointment.company_id != current_user.company_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this appointment")

    return appointment


# ✅ Update Appointment
@router.put("/{appointment_id}")
def edit_appointment(
    appointment_id: int,
    appointment_update: schemas.AppointmentUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Get existing appointment for authorization check
    appointment = crud.get_appointment_by_id(db, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # ✅ Authorization checks
    if current_user.user_type == "super_admin":
        # Super admin can update everything
        pass
    elif current_user.user_type == "doctor":
        # Doctor can only update their own appointments
        doctor = db.query(models.Doctor).filter(
            models.Doctor.user_id == current_user.id
        ).first()
        if not doctor or appointment.doctor_id != doctor.id:
            raise HTTPException(status_code=403, detail="Not authorized to update this appointment")
    else:
        # Others can only update their company's appointments
        if appointment.company_id != current_user.company_id:
            raise HTTPException(status_code=403, detail="Not authorized to update this appointment")
    
    return crud.update_appointment(db, appointment_id, appointment_update)


# ✅ Delete Appointment
@router.delete("/{appointment_id}", response_model=dict)
def delete_appointment_api(
    appointment_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    # Get existing appointment for authorization check
    appointment = crud.get_appointment_by_id(db, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # ✅ Authorization checks
    if current_user.user_type == "super_admin":
        # Super admin can delete everything
        pass
    elif current_user.user_type == "doctor":
        # Doctor can only delete their own appointments
        doctor = db.query(models.Doctor).filter(
            models.Doctor.user_id == current_user.id
        ).first()
        if not doctor or appointment.doctor_id != doctor.id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this appointment")
    else:
        # Others can only delete their company's appointments
        if appointment.company_id != current_user.company_id:
            raise HTTPException(status_code=403, detail="Not authorized to delete this appointment")
    
    return crud.delete_appointment(db, appointment_id)


# ✅ Update Appointment Status
@router.patch("/{appointment_id}/status", response_model=schemas.Appointment)
def update_appointment_status(
    appointment_id: int,
    status_update: schemas.AppointmentStatusUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Update appointment status and track timeline with timestamps"""
    appointment = crud.get_appointment_by_id(db, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    # ✅ Authorization checks
    if current_user.user_type == "super_admin":
        pass
    elif current_user.user_type == "doctor":
        doctor = db.query(models.Doctor).filter(
            models.Doctor.user_id == current_user.id
        ).first()
        if not doctor or appointment.doctor_id != doctor.id:
            raise HTTPException(status_code=403, detail="Not authorized to update this appointment")
    else:
        if appointment.company_id != current_user.company_id:
            raise HTTPException(status_code=403, detail="Not authorized to update this appointment")
    
    # Normalize incoming status (accept either code or label)
    incoming_raw = (status_update.status or "").strip()
    incoming_lower = incoming_raw.lower()

    # Allow passing either canonical code (LOUNGE) or label (On Lounge)
    if incoming_lower in STATUS_CODE_BY_LABEL:
        new_code = STATUS_CODE_BY_LABEL[incoming_lower]
    else:
        # maybe user passed the code already
        new_code = incoming_raw.upper()

    if new_code not in STATUS_LABEL_BY_CODE:
        raise HTTPException(status_code=400, detail=f"Unknown status: {status_update.status}")

    # Get current timestamp
    current_time = datetime.now().isoformat()

    # Initialize or parse status_timeline
    if not appointment.status_timeline:
        appointment.status_timeline = []
    elif isinstance(appointment.status_timeline, str):
        try:
            appointment.status_timeline = json.loads(appointment.status_timeline)
        except Exception:
            appointment.status_timeline = []

    # Enforce forward-only flow (allow same status or next statuses)
    try:
        current_code = (appointment.status or "LOUNGE").upper()
        flow_codes = [c for c, _ in STATUS_FLOW]
        cur_idx = flow_codes.index(current_code) if current_code in flow_codes else 0
        new_idx = flow_codes.index(new_code)
        if new_idx < cur_idx:
            # Do not allow going backwards
            raise HTTPException(status_code=400, detail=f"Cannot transition backward from {current_code} to {new_code}")
    except ValueError:
        # Unknown current code, allow update
        pass

    # Calculate time taken for previous status (if any)
    if appointment.status_timeline and len(appointment.status_timeline) > 0:
        last_entry = appointment.status_timeline[-1]
        if isinstance(last_entry, dict) and last_entry.get("timestamp"):
            try:
                start_time = datetime.fromisoformat(last_entry.get("timestamp"))
                end_time = datetime.now()
                time_taken = int((end_time - start_time).total_seconds())
                last_entry["time_taken_seconds"] = time_taken
                last_entry["time_taken_minutes"] = round(time_taken / 60, 2)
            except Exception:
                pass

    # Add new status entry with canonical code + label
    new_entry = {
        "status_code": new_code,
        "status_label": STATUS_LABEL_BY_CODE.get(new_code, new_code),
        "timestamp": current_time,
        "changed_by": current_user.name or current_user.email,
    }
    appointment.status_timeline.append(new_entry)

    # Update current status code and label (store code in appointment.status)
    appointment.status = new_code

    db.commit()
    db.refresh(appointment)
    return appointment


@router.get("/debug")
def debug_appointments(db: Session = Depends(get_db)):
    return {"message": "works"}


@router.get("/{appointment_id}/status")
def get_appointment_status(appointment_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Return current status and full timeline for an appointment."""
    appointment = crud.get_appointment_by_id(db, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")

    # Basic authorization: super_admin sees everything; doctors only own; others company
    if current_user.user_type == "super_admin":
        pass
    elif current_user.user_type == "doctor":
        doctor = db.query(models.Doctor).filter(models.Doctor.user_id == current_user.id).first()
        if not doctor or appointment.doctor_id != doctor.id:
            raise HTTPException(status_code=403, detail="Not authorized to access this appointment")
    else:
        if appointment.company_id != current_user.company_id:
            raise HTTPException(status_code=403, detail="Not authorized to access this appointment")

    # Normalize timeline format
    timeline = appointment.status_timeline or []
    if isinstance(timeline, str):
        try:
            timeline = json.loads(timeline)
        except Exception:
            timeline = []

    return {
        "appointment_id": appointment.id,
        "status": appointment.status,
        "status_label": STATUS_LABEL_BY_CODE.get(appointment.status, appointment.status),
        "timeline": timeline,
    }
