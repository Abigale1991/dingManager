<template>
  <div class="cms-page">
    <!-- <p>{{ userRole }}</p> -->
    <el-button v-if="userRole === 'ADMIN'" @click="createAccount">创建新用户</el-button>
    <el-table :data="accounts" style="width: 100%">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="name" label="账号name" />
      <el-table-column prop="user" label="使用人user" />
      <el-table-column prop="type" label="账号类型type" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="editAccount(scope.row)">修改</el-button>
          <!-- <el-button type="danger" @click="deleteAccount(scope.row.id)">删除</el-button> -->
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
    <edit ref="accountDialog" @refresh="fetchData" />
  </div>
</template>

<script>
import edit from './edit.vue'
import request from '@/utils/request'

export default {
  components: {
    edit
  },
  data() {
    return {
      accounts: [],
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
  created() {
    this.fetchData()
  },
  methods: {
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    async fetchData() {
      console.log('fetchData')
      const response = await request({
        url: '/account_list',
        method: 'get',
        params: {
          page_num: this.currentPage,
          page_size: this.pageSize
        }
      })
      console.log(response)
      if (response.errCode === 0) {
        this.accounts = response.data.rows
        this.totalItems = response.data.totalCount
      }
    },
    createAccount() {
      this.$refs.accountDialog.show()
    },
    editAccount(account) {
      this.$refs.accountDialog.show(account)
    },
    async deleteAccount(id) {
      try {
        await request({ url: '/delete_account', method: 'post', data: { id }})
        this.$message.success('删除成功')
        this.fetchData()
      } catch {
        this.$message.error('删除失败')
      }
    }
  }
}
</script>

<style scoped>
.cms-page {
  padding: 20px;
}
.header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
