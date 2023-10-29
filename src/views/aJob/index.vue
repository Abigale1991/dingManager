<template>
  <div>
    <el-button v-if="userRole === 'ADMIN'" @click="openDialog">创建新岗位</el-button>

    <el-table :data="jobList">
      <el-table-column prop="areaName" label="省市" />
      <el-table-column prop="jobName" label="岗位名称" />
      <el-table-column prop="corporate" label="公司" />
      <el-table-column prop="salaryMin" label="最低薪资" />
      <el-table-column prop="salaryMax" label="最高薪资" />
      <el-table-column prop="features" label="岗位特点" />
      <el-table-column prop="addr" label="详细地址" />
      <el-table-column prop="jobDescription" label="职位描述" width="400" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />

      <el-table-column label="操作">
        <template v-slot:default="scope">
          <el-button @click="editJob(scope.row)">编辑</el-button>
          <el-button @click="topJob(scope.row)">置顶</el-button>
          <el-button v-if="userRole === 'ADMIN'" @click="modifyJobStatus(scope.row.id, 1)">删除</el-button>
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
import request from '@/utils/request' // 假设这是你的请求工具方法

export default {
  components: {
    JobDialog
  },
  data() {
    return {
      jobList: [],
      currentJob: null,
      items: [], // 数据列表
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
      const response = await request({ url: '/job_list', method: 'get', data: { page_num: this.currentPage, page_size: 10 }})
      if (response.errCode === 0) {
        this.jobList = response.data
        // this.totalCount = response.data.length * 10 // 假设每次都返回10条
        this.totalItems = response.data.total
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1 // 当改变每页显示数量时, 通常会回到第一页
      this.fetchJobs() // 从服务器获取数据
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchJobs() // 从服务器获取数据
    },
    openDialog() {
      this.$refs.jobDialog.show()
    },
    editJob(job) {
      this.$refs.jobDialog.show(job)
    },
    async topJob(job) {
      // 这里调用相应的API进行置顶操作
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
