export default defineAppConfig({
    docus: {
      title: 'juicyllama',
      description: 'The best place to start your documentation.',
      image: 'https://juicyllama.com/assets/images/icon.png',
      socials: {
        github: 'juicyllama/framework'
      },
      aside: {
        level: 0,
        exclude: [
			'/apps/readme', '/gettingstarted',
		],
		openActiveMenu: true
      },
      header: {
        logo: false,
		textLinks: [{
			text: 'Framework',
			href: '/gettingstarted'
		  },{
			text: 'Apps',
			href: '/apps/readme'
		  },{
			text: 'Enterprise',
			href: '/enterprise/readme'
		  }],
      },
      footer: {
        credits:{
          icon: '',
          href: 'https://docs.juicyllama.com/',
          text: 'JuicyLlama'
        }
      }
    }
  })
