from tortoise import fields, models
from passlib.context import CryptContext

# Using pbkdf2_sha256 for better compatibility with Python 3.13+
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

class User(models.Model):
    id = fields.IntField(pk=True)
    username = fields.CharField(max_length=50, unique=True)
    hashed_password = fields.CharField(max_length=128)
    email = fields.CharField(max_length=255, unique=True)
    is_active = fields.BooleanField(default=True)
    is_superuser = fields.BooleanField(default=False)
    created_at = fields.DatetimeField(auto_now_add=True)

    class Meta:
        table = "users"

