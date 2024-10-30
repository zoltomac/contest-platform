from django.contrib import admin
from .models import (Contest, User, GradeCriterion, Address, Entry, Person,
                     Grade, School)

class GradeCriterionAdmin(admin.ModelAdmin):
    list_display = ["title", "max_rating", "active"]
    list_filter = ["active"]

class GradeCriterionInline(admin.TabularInline):
    model = GradeCriterion

class GradeInline(admin.TabularInline):
    model = Grade

class JurorsInline(admin.TabularInline):
    model = Contest.jurors.through

class ContestAdmin(admin.ModelAdmin):
    list_display = ["title", "date_start", "date_end", "individual", "type", "active"]
    list_filter = ["active"]
    fieldsets = [
    (
        None,
        {
            "fields": ["title", "description", ("date_start", "date_end"), ("individual", "type"), ("rules_pdf", "poster_img"), "jurors", "grade_criterions", "active"],
        },
    ),
    ]
    inlines = [JurorsInline]

class UserAdmin(admin.ModelAdmin):
    list_display = ["username", "email", "is_jury", "is_coordinating_unit", "is_staff", "is_active"]

class EntryAdmin(admin.ModelAdmin):
    list_display = ["entry_title", "contest", "is_contest_active", "user", "email", "date_submitted"]

    def is_contest_active(self, obj):
        return obj.contest.active
    is_contest_active.boolean = True

    # list_filter = ["is_contest_active"]
    
    inlines = [GradeInline]
   

# Register your models here.

admin.site.register(Contest, ContestAdmin)
admin.site.register(User, UserAdmin)
admin.site.register(GradeCriterion, GradeCriterionAdmin)
admin.site.register(Address)
admin.site.register(Entry, EntryAdmin)
admin.site.register(Person)
admin.site.register(Grade)
admin.site.register(School)
