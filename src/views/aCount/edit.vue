<template>
  <el-dialog :title="`${type}用户`" :visible.sync="dialogVisible">
    <el-form :model="form">
      <el-form-item label="账号" prop="account">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="密码" prop="passwd" :rules="[ { required: true, message: '必填' } ]">
        <el-input v-model="form.passwd" type="password" />
      </el-form-item>
      <el-form-item label="使用人" prop="user">
        <el-input v-model="form.user" />
      </el-form-item>
      <el-form-item label="类型" prop="user">
        <el-select v-model="form.type">
          <el-option label="ADMIN" :value="0" />
          <el-option label="NORMAL" :value="1" />
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submit">确认{{ type }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        id: null,
        name: '', // 账号
        passwd: '', // 密码
        user: '', // 使用人
        type: '' // 0是admin 1是普通用户
      }
    }
  },
  computed: {
    type() {
      return this.form.id ? '修改' : '创建'
    }
  },
  methods: {
    show(account) {
      if (account) {
        this.form.id = account.id
        this.form.name = account.name
        this.form.user = account.user
        this.form.passwd = account.passwd
        this.form.type = account.type === 'ADMIN' ? 0 : 1
      } else {
        this.form.id = null
        this.form.name = ''
        this.form.user = ''
        this.form.passwd = ''
        this.form.type = ''
      }
      this.dialogVisible = true
    },
    async submit() {
      try {
        if (this.form.id) {
          await request({ url: '/update_account', method: 'post', data: this.form })
        } else {
          await request({ url: '/create_account', method: 'post', data: this.form })
        }
        this.$message.success('操作成功')
        this.$emit('refresh')
        this.dialogVisible = false
      } catch {
        this.$message.error('操作失败')
      }
    }
  }
}
</script>
