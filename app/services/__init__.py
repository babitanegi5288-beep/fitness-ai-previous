from sqlalchemy.orm import Session

from app.core import verify_password
from app.models import User


def authenticate_user(
    db: Session,
    email: str,
    password: str
):
    user = (
        db.query(User)
        .filter(User.Email == email)
        .first()
    )

    if not user:
        return None

    if not verify_password(password, user.Password):
        return None

    return user