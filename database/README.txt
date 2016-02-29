### Liquibase setup

Download and install liquibase to be used on the command line.

From https://github.com/liquibase/liquibase/releases/download/liquibase-parent-3.4.2/liquibase-3.4.2-bin.tar.gz

Download postgres jdbc driver from https://jdbc.postgresql.org/download/postgresql-9.3-1103.jdbc3.jar

and move the .jar to your install's /lib directory

add a symbolic link to use liquibase on your command line:

`sudo ln -s /home/ltfridev/liquibase-3.4.2-bin/liquibase /usr/local/bin/liquibase`


Once Your spatial tables and data have been setup run in.

`liquibase changeLogSync` -- to create the liquibase tables.

`liquibase update -- to run in latest changes.
