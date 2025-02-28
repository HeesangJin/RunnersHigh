# Import all the models, so that Base has them before being
# imported by Alembic
from app.db.base_class import Base  # noqa
from app.models.runner import Runner  # noqa
from app.models.race import Race  # noqa
from app.models.result import Result  # noqa
