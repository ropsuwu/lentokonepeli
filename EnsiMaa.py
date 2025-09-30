import mysql.connector
sqlconnection = mysql.connector.connect(
    host='localhost',
    port='3306',
    database='flight_game',
    user='roope',
    password='nakki',
    autocommit=True
)

def ensimatka():
    while True:
        nimi = input("Valitse aloitus maa antamalla maan nimi: ").lower()
        location1 = f"SELECT name FROM country WHERE name = '{nimi}'"
        print(location1)
        kursori = sqlconnection.cursor()
        kursori.execute(location1)
        rivi = kursori.fetchone()
        if rivi:
            return rivi[0][0]
        else:
            print("Maata ei löytynyt")
        if rivi:
            iso_code = rivi[0]

            # Haetaan ensimmäinen large_airport tästä maasta
            sql_airport = f"SELECT airport.name FROM airport WHERE airport.iso_country = '{iso_code}' AND airport.type = 'large_airport'"
            kursori.execute(sql_airport)
            kentta = kursori.fetchone()

            if kentta:
                return kentta[0], nimi  # palautetaan (lentokentän nimi, maan nimi)
            else:
                print("Tästä maasta ei löytynyt large_airport -tyyppisiä kenttiä.")





