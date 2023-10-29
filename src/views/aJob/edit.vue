<template>
  <el-dialog :visible.sync="dialogVisible" :title="type + '岗位'" width="70%">
    <el-form ref="form" :model="form" label-width="120px">

      <el-form-item label="岗位名称" prop="jobName" :rules="[ { required: true, message: '岗位名称是必填的' } ]">
        <el-input v-model="form.jobName" />
      </el-form-item>

      <el-form-item label="详细地址">
        <el-input v-model="form.addr" />
      </el-form-item>

      <el-form-item label="薪资范围">
        <el-row :gutter="10">
          <el-col :span="10">
            <el-input-number v-model="form.salaryMin" placeholder="最小值" />
          </el-col>
          <el-col :span="2" style="text-align: center;">
            <span>到</span>
          </el-col>
          <el-col :span="10">
            <el-input-number v-model="form.salaryMax" placeholder="最大值" />
          </el-col>
        </el-row>
      </el-form-item>

      <el-form-item label="岗位特点" prop="features" :rules="[ { required: true, message: '岗位特点是必填的' } ]">
        <el-input v-model="form.features" />
      </el-form-item>

      <el-form-item label="公司名称" prop="corporate" :rules="[ { required: true, message: '公司名称是必填的' } ]">
        <el-input v-model="form.corporate" />
      </el-form-item>

      <el-form-item label="职位描述" prop="jobDescription" :rules="[ { required: true, message: '职位描述是必填的' } ]">
        <el-input v-model="form.jobDescription" type="textarea" />
      </el-form-item>

      <el-form-item label="区域" prop="selectedArea">
        <el-select v-model="selectedArea" placeholder="请选择区域" @change="handleAreaChange">
          <el-option
            v-for="area in areas"
            :key="area.id"
            :label="area.areaName"
            :value="area.areaName"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="厂区图片">
        <el-upload
          :file-list="fileList"
          :limit="4"
          :on-exceed="handleExceed"
          :before-upload="beforeImageUpload"
          action="http://fake-url.com"
          multiple
          list-type="text"
          :on-remove="handleRemove"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>

    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import request from '@/utils/request'
import axios from 'axios'

export default {
  data() {
    return {
      dialogVisible: false,
      form: {
        id: null,
        jobName: '',
        addr: '',
        salaryMin: null,
        salaryMax: null,
        features: '',
        corporate: '',
        jobDescription: ''
      },
      areas: [],
      selectedArea: null,
      fileList: []
    }
  },
  computed: {
    type() {
      return this.form.id ? '修改' : '创建'
    }
  },
  mounted() {
    this.fetchAreas()
  },
  methods: {
    async fetchAreas() {
      try {
        const response = await axios.get('http://43.140.214.150:8088/api/employ/area_list')
        console.log('area', response)
        if (response.data.errCode === 0) {
          this.areas = response.data.data
        } else {
          console.error('Error fetching areas:', response.data.errMsg)
        }
      } catch (error) {
        console.error('Error fetching areas:', error)
      }
    },
    handleAreaChange(value) {
      this.selectedArea = value
      this.form.areaName = value
      console.log('Selected Area ID:', value)
    },
    show(job) {
      if (job) {
        Object.assign(this.form, job)
      } else {
        Object.keys(this.form).forEach(key => {
          if (key !== 'id') this.form[key] = null
        })
      }
      this.dialogVisible = true
    },
    async submit() {
      try {
        const apiUrl = this.form.id ? '/update_job' : '/create_job'
        const response = await request({ url: apiUrl, method: 'post', data: this.form })
        if (response.errCode === 0) {
          this.$message.success('操作成功')
        } else {
          this.$message.error('操作失败')
        }
        this.$emit('refresh')
        this.dialogVisible = false
      } catch {
        this.$message.error('操作失败2')
      }
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 4 张图片`)
    },
    beforeImageUpload(file) {
      return new Promise((resolve, reject) => {
        const formData = new FormData()
        formData.append('file', file)
        try {
          request({
            url: '/upload',
            method: 'post',
            data: formData,
            headers: {
              'Content-Type': 'multipart/form-data',
              token: '-lV_6dtEI'
            }
          }).then(response => {
            console.log(response)
            if (response.errCode === 0) {
              this.fileList.push({ name: file.name })
              this.$message.success('上传成功')
            } else {
              this.$message.error('上传失败')
            }
          })
        } catch (error) {
          this.$message.error('上传失败')
        }
        reject()// 阻止默认上传行为
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    }
  }
}
</script>
