export default [
  {
    _name: 'CSidebarNav',
    _children: [
      {
        _name: 'CSidebarNavItem',
        name: 'Asosiy Panel',
        to: '/dashboard',
        icon: 'cil-speedometer',
        // badge: {
        //   color: 'primary',
        //   text: 'NEW'
        // }
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Gazetalar']
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Gazetalar',
        to: '/newspaper',
        icon: 'cil-newspaper',
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['To\'lovlar']
      },
      {
        _name: 'CSidebarNavItem',
        name: 'To\'lovlar',
        to: '/payment',
        icon: 'cil-money',
      },
      {
        _name: 'CSidebarNavTitle',
        _children: ['Foydalanuvchilar']
      },
      {
        _name: 'CSidebarNavItem',
        name: 'Foydalanuvchilar',
        to: '/users',
        icon: 'cil-user',
      },
    ]
  }
]