# Jaen CMS + Zitadel IAM limitations

The migration to the Zitadel IAM GraphQL backend via GQty currently only provides
read access to user accounts. The following capabilities from the previous
resource service are not yet available:

- Creating new users directly from the CMS interface.
- Updating user attributes (name, email, phone, roles, etc.) in the IAM tenant.
- Deleting users or deactivating their access.
- Managing credentials, such as resetting passwords or triggering email
  verification flows.
- Editing role assignments or permissions beyond what is exposed by Zitadel's
  read-only user profile query.

Until these features are exposed by the Zitadel IAM API we keep the CMS forms in
read-only mode (they only update local state). Any administrative changes must
currently be performed through the Zitadel console.
