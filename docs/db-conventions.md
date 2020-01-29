From https://www.postgresql.org/docs/11/ddl-schemas.html

A database contains one or more named schemas, which in turn contain tables. Schemas also contain other kinds of named objects, including data types, functions, and operators. The same object name can be used in different schemas without conflict; for example, both schema1 and myschema can contain tables named mytable. Unlike databases, schemas are not rigidly separated: a user can access objects in any of the schemas in the database they are connected to, if they have privileges to do so.

Basically, using schemas with a setup RBAC system can allow for clear seperation of data, without causing any real overhead or anything
