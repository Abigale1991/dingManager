<template>
  <div class="cms-page">
    <el-button v-if="userRole === 'ADMIN'" @click="create">新建</el-button>

    <el-table :data="list" style="width: 100%">
      <el-table-column prop="id" label="id" />
      <el-table-column prop="name" label="门店名称" />
      <el-table-column prop="addr" label="地址" />
      <el-table-column prop="areaId" label="区域" />
      <el-table-column prop="manager" label="门店管理人" />
      <el-table-column prop="longitude" label="门店坐标lon" />
      <el-table-column prop="latitude" label="门店坐标lat" />
      <el-table-column prop="tel" label="电话" />
      <el-table-column prop="createTime" label="createTime" />
      <el-table-column prop="updateTime" label="updateTime" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-button @click="edit(scope.row)">编辑</el-button> -->
          <el-button v-if="userRole === 'ADMIN'" type="danger" @click="deleteRow(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <edit ref="edit" @refresh="fetch" />
    <el-pagination
      :current-page="currentPage"
      :page-sizes="[2, 5, 10, 20]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalItems"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
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
      list: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0
    }
  },
  computed: {
    userRole() {
      // 从store获取用户角色
      return this.$store.state.user.type
    }
  },
  created() {
    this.fetch()
  },
  methods: {

    async fetch() {
      console.log('fetch')
      const response = await request({ url: '/recruitment_shop_list', method: 'get', params: { page_num: this.currentPage, page_size: this.pageSize, areaId: 1 }})
      console.log(response)
      if (response.errCode === 0) {
        this.list = response.data.rows
        this.totalItems = response.data.totalCount
      }
    },
    create() {
      this.$refs.edit.show()
    },
    edit(shop) {
      this.$refs.edit.show(shop)
    },
    async deleteRow(id) {
      console.log('del', id)
      const response = await request({ url: '/delete_recruitment_shop', method: 'post', data: { id: id }})
      if (response.data.success) {
        this.$message.success('成功')
        this.fetch()
      } else {
        this.$message.error('失败')
      }
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPage = 1
      this.fetch()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetch()
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
