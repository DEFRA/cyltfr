\o ufmfsw_flow_direction_1_in_100_errors_before_clean.log

\i ./1-is-valid-dml.sql

\o

\i ./2-make-valid-ddl.sql
\i ./3-drop-table-ddl.sql
\i ./4-rename-valid-table-ddl.sql
\i ./5-create-spatial-index-ddl.sql

\o ufmfsw_flow_direction_1_in_100_errors_after_clean.log

\i ./6-is-valid-final-check-dml.sql

\o

\i ./7-cluster-ddl.sql

\i ./8-attribute-index-ddl.sql
