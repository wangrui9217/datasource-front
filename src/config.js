
const _config ={
	'development': {
		baseURL: '/dsIntegration-manager',
		BASE_FILE_URL: ''
	},
	'test': this.development,
	'production': {
		baseURL: '/dsIntegration-manager',
		BASE_FILE_URL: ''
	}
}
const baseURL = _config[process.env.NODE_ENV].baseURL

export { baseURL }
