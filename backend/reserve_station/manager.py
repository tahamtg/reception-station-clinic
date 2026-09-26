from django.contrib.auth.models import BaseUserManager

class Personels(BaseUserManager):

    def create_user(self, username, password=None, **extra_fields):

        if not username:
            raise ValueError("نام کاربری الزامی است")

        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        extra_fields.setdefault("is_active", True)

        return user

    def create_superuser(self, username, password=None, **extra_fields):

        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)

        return self.create_user(
            username=username,
            password=password,
            **extra_fields
        )
