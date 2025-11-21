from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import date
import models
from models import Doctor, Appointment
from database import get_db

router = APIRouter()

@router.get("/generate-token/{doctor_id}")
def generate_token(doctor_id: int, visitDate: date, db: Session = Depends(get_db)):
    # get doctor prefix
    doctor = db.query(Doctor).filter(Doctor.id == doctor_id).first()
    prefix = doctor.prefix  # example: "MN"

    # check existing appointments for that day
    count = db.query(Appointment).filter(
        Appointment.doctor_id == doctor_id,
        Appointment.visitDate == visitDate
    ).count()

    # If no appointments → start MN01
    new_number = count + 1
    token = f"{prefix}{new_number:02d}"  # MN01, MN02...

    return {"token": token}
