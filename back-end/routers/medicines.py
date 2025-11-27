from fastapi import APIRouter, Depends, HTTPException, Form, File, UploadFile
from sqlalchemy.orm import Session
from database import get_db
from models import Medicine
from schemas import MedicineResponse
from datetime import datetime


router = APIRouter(prefix="/medicines", tags=["Medicines"])

@router.get("/", response_model=list[MedicineResponse])
def get_medicines(db: Session = Depends(get_db)):
    return db.query(Medicine).filter(Medicine.is_deleted == False).all()

@router.delete("/{medicine_id}")
def delete_medicine(medicine_id: int, db: Session = Depends(get_db)):
    medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    medicine.is_deleted = True
    medicine.deleted_at = datetime.now()

    db.commit()
    return {"message": "Medicine soft deleted successfully"}


# CREATE medicine
@router.post("/", response_model=MedicineResponse)
async def create_medicine(
    name: str = Form(...),
    genericname: str = Form(""),
    entrydate: datetime = Form(""),        
    expireddate: datetime = Form(""),
    category: str = Form(""),
    description: str = Form(""),
    strength: str = Form(""),
    dosage: str = Form(""),
    manufacturer: str = Form(""),
    chemical: str = Form(""),
    remarks: str = Form(""),
    document: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    file_bytes = None
    if document:
        file_bytes = await document.read()

    new_medicine = Medicine(
        name=name,
        genericname=genericname,
        entrydate=entrydate,
        expireddate=expireddate,
        category=category,
        description=description,
        strength=strength,
        dosage=dosage,
        manufacturer=manufacturer,
        chemical=chemical,
        remarks=remarks,
        document=file_bytes
    )

    db.add(new_medicine)
    db.commit()
    db.refresh(new_medicine)

    return new_medicine

# UPDATE medicine
@router.put("/{medicine_id}", response_model=MedicineResponse)
async def update_medicine(
    medicine_id: int,
    name: str = Form(...),
    genericname: str = Form(""),
    entrydate: str = Form(""),
    expireddate: str = Form(""),
    category: str = Form(""),
    description: str = Form(""),
    strength: str = Form(""),
    dosage: str = Form(""),
    manufacturer: str = Form(""),
    chemical: str = Form(""),
    remarks: str = Form(""),
    db: Session = Depends(get_db)
):
    from datetime import datetime

    medicine = db.query(Medicine).filter(Medicine.id == medicine_id).first()

    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    # Convert string → Python date
    entrydate_obj = datetime.strptime(entrydate, "%Y-%m-%d").date() if entrydate else None
    expireddate_obj = datetime.strptime(expireddate, "%Y-%m-%d").date() if expireddate else None

    medicine.name = name
    medicine.genericname = genericname
    medicine.entrydate = entrydate_obj
    medicine.expireddate = expireddate_obj
    medicine.category = category
    medicine.description = description
    medicine.strength = strength
    medicine.dosage = dosage
    medicine.manufacturer = manufacturer
    medicine.chemical = chemical
    medicine.remarks = remarks

    db.commit()
    db.refresh(medicine)

    return medicine