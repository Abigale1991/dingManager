<template>
  <el-dialog :title="`${type}用户`" :visible.sync="dialogVisible" width="70%">
    <el-form :model="form">
      <el-form-item label="门店名称" prop="name"><el-input v-model="form.name" /></el-form-item>
      <el-form-item label="地址" prop="addr"><el-input v-model="form.addr" /></el-form-item>
      <el-form-item label="区域" prop="areaId"><el-input v-model="form.areaId" /></el-form-item>
      <el-form-item label="门店管理人" prop="manager"><el-input v-model="form.manager" /></el-form-item>
      <el-form-item label="门店坐标lon" prop="longitude"><el-input v-model="form.longitude" /></el-form-item>
      <el-form-item label="门店坐标lat" prop="latitude"><el-input v-model="form.latitude" /></el-form-item>
      <el-form-item label="电话" prop="tel"><el-input v-model="form.tel" /></el-form-item>
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
        name: '', // 门店名称
        addr: '', // 地址
        areaId: '', // 区域
        manager: '', // 门店管理人
        longitude: '', // 门店坐标lon
        latitude: '', // 门店坐标lat
        tel: '' // 电话
      }
    }
  },
  computed: {
    type() {
      return this.form.id ? '修改' : '创建'
    }
  },
  methods: {
    show(shop) {
      if (shop) {
        this.form.id = shop.id
        this.form.name = shop.name
        this.form.addr = shop.addr
        this.form.areaId = shop.areaId
        this.form.manager = shop.manager
        this.form.longitude = shop.longitude
        this.form.latitude = shop.latitude
        this.form.tel = shop.tel
      } else {
        this.form.id = null
        this.form.name = ''
        this.form.addr = ''
        this.form.areaId = ''
        this.form.manager = ''
        this.form.longitude = ''
        this.form.latitude = ''
        this.form.tel = ''
      }
      this.dialogVisible = true
    },
    async submit() {
      try {
        if (this.form.id) {
          // await request({ url: '/update_account', method: 'post', data: this.form })
        } else {
          await request({ url: '/add_recruitment_shop', method: 'post', data: this.form })
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
