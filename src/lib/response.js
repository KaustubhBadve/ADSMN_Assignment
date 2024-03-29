const constants = require("../constants/constant");
async function getErrorMessage(errCode) {
	let resMessage;
	switch (errCode) {
		case constants.response_code.JWT:
			resMessage = "Invalid Access Token!";
			break;

		case constants.response_code.UNAUTHORIZED:
			resMessage = "You are not authorized!";
			break;

		case constants.response_code.FORBIDDEN:
			resMessage = "This action is forbidden for you!";
			break;

		case constants.response_code.NOT_FOUND:
			resMessage = "Data not found";
			break;

		default:
			resMessage = "Some unknown error occurred!";
			break;
	}
	return resMessage;
}
function errors(err) {
	var finaError = [];
	if (err) {
		for (field in err.errors) {
			if (!finaError.includes(err.errors[field].msg)) {
				finaError.push(err.errors[field].msg);
			}
		}
	}

	return finaError;
}

sendResponse = async (resCode, resMessage, data, res, error) => {
	if (resCode > constants.response_code.MAX_SUCCESS_CODE) {
		resMessage = resMessage || getErrorMessage(resCode);
		data = null;
	}
	return res.status(resCode).json({
		status: {
			code: resCode,
			message: resMessage,
		},
		data: data,
		error: errors(error),
	});
};

module.exports = {
	sendResponse
};