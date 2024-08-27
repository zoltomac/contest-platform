from django.contrib import admin
from .models import (Contest, User, GradeCriterion, Address, Entry, Person,
                     Grade, School)

class GradeCriterionInline(admin.TabularInline):
    model = GradeCriterion

class JurorsInline(admin.TabularInline):
    model = Contest.jurors.through

class ContestAdmin(admin.ModelAdmin):
    list_display = ["title", "date_start", "date_end", "individual", "type"]
    fieldsets = [
    (
        None,
        {
            "fields": ["title", "description", ("date_start", "date_end"), ("individual", "type"), ("rules_pdf", "poster_img"), "jurors"],
        },
    ),
    ]
    inlines = [GradeCriterionInline, JurorsInline]

class UserAdmin(admin.ModelAdmin):
    list_display = ["username", "email", "is_jury", "is_coordinating_unit", "is_staff", "is_active"]

# Register your models here.

admin.site.register(Contest, ContestAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(GradeCriterion)
admin.site.register(Address)
admin.site.register(Entry)
admin.site.register(Person)
admin.site.register(Grade)
admin.site.register(School)
