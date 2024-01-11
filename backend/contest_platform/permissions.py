from rest_framework import permissions
from rest_framework.generics import GenericAPIView
from rest_framework.request import Request

from django.db import models


class UserPermission(permissions.BasePermission):

    def has_permission(self, request: Request, view: GenericAPIView) -> bool:

        if view.action == "create":
            return True
        if view.action == "list":
            return request.user.is_authenticated and request.user.is_staff
        elif view.action in ["retrieve", "update", "partial_update", "destroy", "current_user"]:
            return True
        else:
            return False

    def has_object_permission(
        self, request: Request, view: GenericAPIView, obj: models.Model
    ) -> bool:

        if not request.user.is_authenticated:
            return False

        if view.action in ["retrieve", "update", "partial_update", "current_user"]:
            # a user can view its own info, or a staff can view any user's info
            return obj == request.user or request.user.is_staff
        elif view.action == "destroy":
            return request.user.is_staff
        else:
            return False


class ContestPermission(permissions.BasePermission):

    def has_permission(self, request: Request, view: GenericAPIView) -> bool:

        if view.action in ["list", "max_rating_sum", "retrieve", "update", "partial_update", "destroy"]:
            return True
        else:
            return False

    def has_object_permission(
        self, request: Request, view: GenericAPIView, obj: models.Model
    ) -> bool:

        if view.action == "retrieve":
            return True
        elif view.action in ["update", "partial_update", "destroy", "max_rating_sum"]:
            return request.user.is_authenticated and (request.user.is_staff or request.user.is_jury)
        else:
            return False


class EntryPermission(permissions.BasePermission):
    def has_permission(self, request: Request, view: GenericAPIView) -> bool:
        if view.action == "list":
            return request.user.is_authenticated and request.user.is_staff
        if view.action == "create":
            return request.user.is_authenticated
        if view.action in ["retrieve", "update", "partial_update", "destroy"]:
            return True

    def has_object_permission(
        self, request: Request, view: GenericAPIView, obj: models.Model
    ) -> bool:
        if view.action in ["retrieve", "update", "partial_update", "destroy"]:
            # @TODO change for user to only access own entry
            return request.user.is_authenticated
        else:
            return False


class AssessmentCriterion(permissions.BasePermission):
    def has_permission(self, request: Request, view: GenericAPIView) -> bool:
        if view.action == "list":
            return request.user.is_authenticated and request.user.is_staff
        if view.action == "create":
            return request.user.is_authenticated and request.user.is_staff
