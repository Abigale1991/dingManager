<template>
  <div>
    <el-button v-if="userRole === 'ADMIN'" @click="openDialog">创建新岗位</el-button>

    <el-table :data="jobList">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="jobName" label="岗位名称" />
      <el-table-column prop="salaryMin" label="最低薪资" />
      <el-table-column prop="salaryMax" label="最高薪资" />
      <el-table-column prop="features" label="岗位特点" />
      <el-table-column prop="corporate" label="公司" />
      <el-table-column prop="addr" label="详细地址" />
      <el-table-column prop="logo" label="logo" />
      <el-table-column prop="jobStatus" label="jobStatus" />
      <el-table-column prop="corporatePics" label="厂区图片" />
      <el-table-column prop="jobDescription" label="职位描述" width="400" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column prop="areaName" label="省市" />

      <el-table-column label="操作">
        <template v-slot:default="scope">
          <!-- <el-button @click="editJob(scope.row)">编辑</el-button> -->
          <el-button @click="topJob(scope.row)">置顶</el-button>
          <el-button v-if="userRole === 'ADMIN'" @click="deleteJob(scope.row)">删除</el-button>
          <el-button @click="modifyJobStatus(scope.row.id, 3)">上架</el-button>
          <el-button @click="modifyJobStatus(scope.row.id, 4)">下架</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :current-page="currentPage"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalItems"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <job-dialog ref="jobDialog" @refresh="fetchJobs" />
  </div>
</template>

<script>
import JobDialog from './edit.vue'
import request from '@/utils/request'

export default {
  components: {
    JobDialog
  },
  data() {
    return {
      jobList: [],
      currentJob: null,
      totalItems: 0, // 总数据数量
      currentPage: 1, // 当前页
      pageSize: 10 // 每页显示的数据数量
    }
  },
  computed: {
    userRole() {
      // 从store获取用户角色
      return this.$store.state.user.type
    }
  },
  mounted() {
    this.fetchJobs()
  },
  methods: {
    async fetchJobs() {
      const response = await request({ url: '/job_list', method: 'get', params: { page_num: this.currentPage, page_size: this.pageSize, areaId: 0, status: 0 }})
      if (response.errCode === 0) {
        this.jobList = response.data.rows
        this.totalItems = response.data.totalCount
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.fetchJobs()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchJobs()
    },
    openDialog() {
      this.$refs.jobDialog.show()
    },
    editJob(job) {
      this.$refs.jobDialog.show(job)
    },
    async deleteJob(job) {
      const response = await request({ url: '/delete_job', method: 'post', data: { id: job.id }})
      if (response.errCode === 0) {
        this.$message.success('操作成功')
        this.fetchJobs()
      }
    },
    async topJob(job) {
      const response = await request({ url: '/set_hot_job', method: 'post', data: { id: job.id }})
      if (response.errCode === 0) {
        this.$message.success('操作成功')
        this.fetchJobs()
      }
    },
    async modifyJobStatus(id, status) {
      const response = await request({ url: '/modify_job_status', method: 'post', data: { id, jobStatus: status }})
      if (response.errCode === 0) {
        this.$message.success('操作成功')
        this.fetchJobs()
      }
    },

    pageChanged(newPage) {
      this.currentPage = newPage
      this.fetchJobs()
    }
  }
}
</script>
