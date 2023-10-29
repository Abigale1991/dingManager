<template>
  <div>
    <el-select v-model="statusFilter" style="margin-right: 10px;" @change="filterByStatus">
      <el-option
        v-for="status in statusOptions"
        :key="status"
        :label="status"
        :value="status"
      />
    </el-select>
    <el-button icon="el-icon-search" @click="fetchData">搜索</el-button>

    <!-- 岗位预约列表表格 -->
    <el-table ref="myTable" v-loading="loading" :data="jobBookings" border>
      <el-table-column prop="id" label="id" />
      <el-table-column prop="jobName" label="岗位名称" />
      <el-table-column prop="corporate" label="公司" />
      <el-table-column prop="name" label="预约人姓名" />
      <el-table-column prop="tel" label="电话" />
      <el-table-column prop="workerOpenId" label="员工id" />
      <el-table-column prop="refereeOpenId" label="推荐人id" />

      <el-table-column label="在职状态">
        <template slot-scope="scope">
          <el-select v-model="scope.row.statusStr" @change="handleStatusChange(scope.row)">
            <el-option
              v-for="status in statusOptions"
              :key="status"
              :label="status"
              :value="status"
            />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="deleteRow(scope.row)">删除</el-button>
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
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  data() {
    return {
      jobBookings: [],
      loading: false,
      statusFilter: '',
      statusOptions: [
        '取消',
        '已离职',
        '待跟踪',
        '已预约未回访',
        '电话已回访未面试',
        '电话已回访已邀面试',
        '面试成功',
        '面试失败',
        '待入职',
        '已入职'
      ],
      o: {
        '取消': '-1',
        '已离职': '0',
        '待跟踪': '1',
        '已预约未回访': '2',
        '电话已回访未面试': '3',
        '电话已回访已邀面试': '4',
        '面试成功': '5',
        '面试失败': '6',
        '待入职': '7',
        '已入职': '8'
      },
      totalItems: 0, // 总数据数量
      currentPage: 1, // 当前页
      pageSize: 10 // 每页显示的数据数量
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.loading = true
      const params = {
        page_num: this.currentPage,
        page_size: this.pageSize,
        status: this.statusFilter ? this.o[this.statusFilter] : 0
      }
      request({
        url: 'worker_list',
        method: 'get',
        params
      }).then(response => {
        this.jobBookings = response.data.rows
        this.totalItems = response.data.totalCount
        this.loading = false
      })
    },

    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },

    handleStatusChange(row) {
      request({
        url: 'set_worker_status',
        method: 'post',
        data: { id: row.id, status: this.o[row.statusStr] }
      }).then(response => {
        if (response.data.success) {
          this.$message.success('状态更新成功')
          this.fetchData()
        } else {
          this.$message.error('状态更新失败')
        }
      })
    },
    // 根据状态筛选
    filterByStatus() {
      console.log('11', this.statusFilter)
      this.fetchData()
    },
    updateStatusFilter(value) {
      console.log(value)

      this.$nextTick(() => {
        this.statusFilter = value
      })
      // this.statusFilter = value
      // this.selectKey++
    },
    // 删除行
    deleteRow(row) {
      // 在这里可以实现删除逻辑
    }
  }
}
</script>

<style scoped>
/* 你可以在这里添加需要的样式 */
</style>
