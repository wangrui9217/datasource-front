const rules = {
    phoneRule: [
        { required: true, trigger: 'blur', message: '请填写手机号' },
        { pattern: /^1\d{10}$/, trigger: 'blur', message: '手机号码错误' }
      ],
      passwordRule: { required: true, trigger: 'blur', message: '请填写密码' },
      organizationRule: { required: true, trigger: 'blur', message: '请选择组织' },
      roleIdRule: { required: true, trigger: 'blur', message: '请选择角色' },
      menuTypeRule: { required: true, trigger: 'blur', message: '请选择菜单类型' },
      parentIdRule: { required: true, trigger: 'blur', message: '请选择父级菜单' },
      realnameRule: [
        { required: true, trigger: 'blur', message: '请填写姓名' },
        { max: 20, message: '20个字符以内', trigger: 'blur' }
      ],
      emailRule: [
        { required: false, trigger: 'blur', message: '请填写邮箱' },
        { type: 'email', message: '邮箱格式错误，请录入正确的邮箱', trigger: 'blur' },
        { max: 100, message: '100个字符以内', trigger: 'blur' }
      ],
      orgRemarkRule: [
        { required: false, trigger: 'blur', message: '请填写备注' },
        { max: 500, message: '500个字符以内', trigger: 'blur' }
      ],
      roleRemarkRule: [
        { required: false, trigger: 'blur', message: '请填写备注' },
        { max: 500, message: '500个字符以内', trigger: 'blur' }
      ],
      menuNameRule: [
        { required: true, trigger: 'blur', message: '请填菜单名称' },
        { max: 20, message: '20个字符以内', trigger: 'blur' }
      ],
      roleNameRule: [
        { required: true, trigger: 'blur', message: '请填角色名称' },
        { max: 40, message: '40个字符以内', trigger: 'blur' }
      ],
      orgNameRule: [
        { required: true, trigger: 'blur', message: '请填组织名称' },
        { max: 40, message: '40个字符以内', trigger: 'blur' }
      ],
      orgCodeRule: [
        { required: true, trigger: 'blur', message: '请填组织代码' },
        { max: 20, message: '20个字符以内', trigger: 'blur' }
      ],
      merchantContactNameRule: [
        { required: true, trigger: 'blur', message: '请填写对接人' },
        { max: 50, message: '50个字符以内', trigger: 'blur' }
      ],
      merchantShortened: [
        { required: false, trigger: 'blur', message: '请填写商户简称' },
        { max: 50, message: '50个字符以内', trigger: 'blur' }
      ],
      merchantContactQq: [
        { required: false, trigger: 'blur', message: '请填Qq' },
        { max: 50, message: '50个字符以内', trigger: 'blur' }
      ],
      merchantContactWechat: [
        { required: false, trigger: 'blur', message: '' },
        { max: 100, message: '100个字符以内', trigger: 'blur' }
      ],
      merchantUrl: [
        { required: false, trigger: 'blur', message: '请填写商戶網址' },
        { max: 300, message: '300个字符以内', trigger: 'blur' }
      ],
      merchantContactNameRule: [
        { required: true, trigger: 'blur', message: '请填写对接人' },
        { max: 50, message: '50个字符以内', trigger: 'blur' }
      ],
}
export default rules