module.exports = {
	components: {
		request: {
			module: '/libs/requestManager'
		},
		
		urlManager: {
			module: '/libs/urlManager',
			method: 'parse',
			//urlSuffix: '.html',
			rules: {
				'/':					{controller: 'game'},
				'(\w+)/(\w+)/(\w+)':	{module: '$1', controller: '$2', action: '$3'},
				'(\w+)/(\w+)':			{controller: '$1', action: '$2'},
				'(\w+)':				{action: '$1'}
			}
		}
	}
};