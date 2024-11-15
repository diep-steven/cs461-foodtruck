CS 461 Foodtruck

To run database locally:
- Postgres must be installed and setup on your machine
- Create a `env.json` file inside `src` with the following:
{
	"user": "pgUsernameHere",
	"host": "localhost",
	"database": "cs461_foodtruck",
	"password": "pgPasswordHere",
	"port": 5432
}
- Once Postgres is setup, run `npm run sql` inside the `src` directory



