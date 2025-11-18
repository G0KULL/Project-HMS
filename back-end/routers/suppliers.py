from fastapi import APIRouter, Depends, HTTPException, Form, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from models import Supplier
from schemas import SupplierOut, SupplierUpdate

from crud import (
    create_supplier,
    get_supplier,
    get_suppliers,
    update_supplier,    
    delete_supplier
)



router = APIRouter(prefix="/suppliers", tags=["Suppliers"])

@router.post("/", response_model=dict)
async def create_new_supplier(
    companyname: str = Form(...),
    description: str = Form(...),
    contactPerson: str = Form(...),
    phone: str = Form(...),
    email: str = Form(...),
    website: str = Form(...),
    address: str = Form(...),
    gst_number: str = Form(...),
    license: UploadFile = File(...),
    user_id: int = Form(...),
    db: Session = Depends(get_db)
):

    print("Received supplier creation request")

    # Save files to disk
    license_path = f"uploads/{license.filename}"

    with open(license_path, "wb") as f:
        f.write(await license.read())

    # Create Supplier in DB
    supplier = Supplier(
        companyname=companyname,
        description=description,
        contactPerson=contactPerson,
        phone=phone,
        email=email,
        address=address,
        gst_number=gst_number,
        website=website,  
        license=license_path,
        user_id=user_id
        
    )

    db.add(supplier)
    db.commit()
    db.refresh(supplier)

    return {"message": "Supplier created", "supplier_id": supplier.id}



@router.get("/", response_model=list[SupplierOut])
def fetch_suppliers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_suppliers(db, skip, limit)


@router.get("/{supplier_id}", response_model=SupplierOut)
def fetch_supplier(supplier_id: int, db: Session = Depends(get_db)):
    result = get_supplier(db, supplier_id)
    if not result:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return result


@router.put("/{supplier_id}", response_model=SupplierOut)
def modify_supplier(
    supplier_id: int, updates: SupplierUpdate, db: Session = Depends(get_db)
):
    result = update_supplier(db, supplier_id, updates)
    if not result:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return result


@router.delete("/{supplier_id}")
def remove_supplier(supplier_id: int, db: Session = Depends(get_db)):
    result = delete_supplier(db, supplier_id)
    if not result:
        raise HTTPException(status_code=404, detail="Supplier not found")
    return {"detail": "Supplier deleted successfully"}
