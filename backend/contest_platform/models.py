from django.db import models
from datetime import date
from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError

# lets us explicitly set upload path and filename
def upload_to(instance, filename):
    return 'images/{filename}'.format(filename=filename)


# REQ_06A
# REQ_23B
class User(AbstractUser):
    is_jury = models.BooleanField(default=False)
    is_coordinating_unit = models.BooleanField(default=False)
# REQ_06A_END
# REQ_23B_END

# REQ_09B
class GradeCriterion(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=500, blank=True)
    max_rating = models.IntegerField(default=10)
    active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return f"{self.title} ({self.max_rating})"
# REQ_09B_END


# REQ_09A
class Contest(models.Model):
    title = models.CharField(max_length=200, default="")
    description = models.TextField(max_length=1800, default="")
    date_start = models.DateField(default=date.today)
    date_end = models.DateField(default=date.today)
    # 1 - konkurs indywidualny; 0 - konkurs grupowy
    individual = models.BooleanField(default=True)
    type = models.CharField(max_length=50, default="")
    rules_pdf = models.FileField(upload_to="rules", blank=True, null=True, max_length=255)
    poster_img = models.ImageField(upload_to=upload_to, null=True, max_length=255)
    jurors = models.ManyToManyField(User, limit_choices_to={"is_jury": True})
    grade_criterions = models.ManyToManyField(GradeCriterion, limit_choices_to={"active": True})
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title} [{self.date_start} -> {self.date_end}]"
# REQ_09A_END


class Address(models.Model):
    class Meta:
        verbose_name_plural = "Addresses"

    street = models.CharField(max_length=50)
    number = models.CharField(max_length=10)
    postal_code = models.CharField(max_length=6)
    city = models.CharField(max_length=20)

    def __str__(self):
        return f"{self.street} {self.number}, {self.postal_code} {self.city}"


# REQ_23
class Person(models.Model):
    name = models.CharField(max_length=20)
    surname = models.CharField(max_length=50)

    def __str__(self) -> str:
        return f"{self.name} {self.surname}"
# REQ_23_END


# REQ_24
class Entry(models.Model):
    class Meta:
        verbose_name_plural = "Entries"
        
    contest = models.ForeignKey(Contest, on_delete=models.PROTECT)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    contestants = models.ManyToManyField(Person)
    date_submitted = models.DateField(default=date.today)
    email = models.EmailField(null=True)
    entry_title = models.CharField(max_length=100)
    entry_file = models.FileField(upload_to=upload_to, null=True, max_length=255)
# REQ_24_END



class Grade(models.Model):
    criterion = models.ForeignKey(GradeCriterion, on_delete=models.CASCADE)
    entry = models.ForeignKey(Entry, on_delete=models.CASCADE)
    value = models.IntegerField()

    class Meta:
        unique_together = [["criterion", "entry"]]

    def clean(self):
        if self.value > self.criterion.max_rating:
            raise ValidationError(
                {
                    "value": "Value must be less than or equal to the max \
            rating of the criterion."
                }
            )
        if not self.entry.contest.grade_criterions.contains(self.criterion):
            raise ValidationError(
                {
                    "criterion": "Criterion has to be from the list defined for the Contest."
                }
            )


class School(models.Model):
    name = models.CharField(max_length=255)
    street = models.CharField(max_length=255)
    building_number = models.CharField(max_length=10)
    apartment_number = models.CharField(max_length=10, blank=True, null=True)
    postal_code = models.CharField(max_length=20)
    city = models.CharField(max_length=255)
    phone = models.CharField(max_length=20)
    fax = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    audience_status = models.CharField(max_length=20)
    institution_specifics = models.CharField(max_length=255)
    director_name = models.CharField(max_length=255)

    class Meta:
        unique_together = (
            "name",
            "street",
            "building_number",
        )

    def __str__(self):
        return f"{self.lp}. {self.name}"
