CS 461 Foodtruck

Make sure Node is installed on your computer. This project uses npm package manager as well.

In the `src` directory, make sure to run `npm install` so all necessary pacakges.

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
- Once Postgres is setup, run `npm run sql` inside the `src` directory so tables and sample data are imported

To run the server, run `npm run start` in the `src` directory. If for some reason this doesnt work,
run `node server.js` inside `src/app`