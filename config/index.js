const options = {
	DB: {
		HOST: "mydatabase.cbuoic482vjw.ap-south-1.rds.amazonaws.com",
		USER: "kaustubh",
		PASSWORD: "Hexahealth123",
		DB: "mydb",
		dialect: "mysql",
		pool: {
			max: 5,
			min: 0,
			acquire: 30000,
			idle: 10000,
		},
	},
};
module.exports = options;
