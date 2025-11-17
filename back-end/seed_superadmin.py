from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models
from models import SuperAdmin
import getpass
import os
from auth import get_password_hash

def create_superadmin(db: Session, name: str, email: str, password: str, address: str = None, phone: str = None, user_type: str = "super_admin" ):
    existing = db.query(SuperAdmin).filter(SuperAdmin.email == email).first()
    if existing:
        print(f"SuperAdmin with email '{email}' already exists (id={existing.id}). Skipping.")
        return existing

    hashed_pw = get_password_hash(password)
    sa = SuperAdmin(name=name, email=email, password=hashed_pw, address=address, phone=phone, user_type=user_type)
    db.add(sa)
    db.commit()
    db.refresh(sa)
    print(f"Created SuperAdmin id={sa.id} email={sa.email}")
    return sa


def main():
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        print("Seeding SuperAdmin table.")
        # Defaults - choose safe example values. Prompt user for a password if running interactively
        default_name = "Super Admin"
        default_email = "admin1@example.com"
        # First check env override for non-interactive runs
        pw = os.environ.get('SEED_SUPERADMIN_PASSWORD')
        if not pw:
            try:
                pw = getpass.getpass("Enter password for super admin (input hidden, leave blank for 'admin'): ")
            except Exception:
                pw = None
        if not pw:
            pw = "admin"

        create_superadmin(db, name=default_name, email=default_email, password=pw, address=None, phone=None)
    finally:
        db.close()


if __name__ == "__main__":
    main()
