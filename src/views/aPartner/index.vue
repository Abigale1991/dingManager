<template>
  <div>
    <!-- 弹出的添加培训对话框 -->
    <el-dialog title="添加培训" :visible.sync="dialogVisible">
      <el-input v-model="trainInfo" placeholder="培训信息" />
      <el-date-picker v-model="beginTime" type="date" placeholder="开始时间" />
      <el-date-picker v-model="endTime" type="date" placeholder="结束时间" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setTrainInfo">发布</el-button>
      </span>
    </el-dialog>
    <el-button @click="dialogVisible = true">添加培训</el-button>
    <!-- 搜索行及“添加培训”按钮 -->
    <div class="search-area">
      <div class="search-inputs">
        <el-input v-model="searchName" placeholder="姓名">
          <template slot="prepend">姓名</template>
        </el-input>
        <el-input v-model="searchTel" placeholder="电话">
          <template slot="prepend">电话</template>
        </el-input>
        <el-input v-model="searchIdentityNo" placeholder="身份证号">
          <template slot="prepend">身份证号</template>
        </el-input>
        <el-button @click="searchPartners">搜索</el-button>
      </div>
    </div>

    <!-- 合伙人管理表格 -->
    <el-table :data="partners" border>
      <el-table-column prop="id" label="id" />
      <el-table-column prop="openId" label="OpenId" />
      <el-table-column prop="name" label="合伙人姓名" />
      <el-table-column prop="tel" label="电话" />
      <el-table-column prop="identityNo" label="身份证号" />
      <el-table-column prop="payOrderNo" label="缴费订单号" />
      <el-table-column prop="status" label="会费状态" />
      <el-table-column prop="payEndTime" label="支付结束时间" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column prop="updateTime" label="更新时间" />
      <el-table-column prop="allCash" label="总现金" />
      <el-table-column prop="cashedAmount" label="已提现金额" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="deletePartner(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination :current-page="currentPage" :page-size="pageSize" :total="totalItems" @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  data() {
    return {
      partners: [],
      currentPage: 1,
      pageSize: 10,
      totalItems: 0,
      searchName: '',
      searchTel: '',
      searchIdentityNo: '',
      trainInfo: '',
      beginTime: '',
      endTime: '',
      dialogVisible: false
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    // fetchData() {
    //   request({
    //     url: 'partner_list',
    //     method: 'get',
    //     params: { page_num: this.currentPage, page_size: this.pageSize }
    //   }).then(response => {
    //     this.partners = response.data
    //     this.totalItems = response.data.length
    //   })
    // },
    fetchData() {
      this.loading = true
      const params = {
        page_num: this.currentPage,
        page_size: this.pageSize
      }
      if (this.searchTel) params.tel = this.searchTel
      if (this.searchName) params.name = this.searchName
      if (this.searchIdentityNo) params.identityNo = this.searchIdentityNo
      request({
        url: 'partner_list',
        method: 'get',
        params
      }).then(response => {
        this.partners = response.data.rows
        this.totalItems = response.data.totalCount
        this.loading = false
      })
    },
    searchPartners() {
      this.currentPage = 1 // 重置当前页为1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.fetchData()
    },
    deletePartner(row) {
      request({
        url: 'partner_exited',
        method: 'post',
        data: { id: row.id }
      }).then(response => {
        if (response.data.success) {
          this.$message.success('删除成功')
          this.fetchData()
        } else {
          this.$message.error('删除失败')
        }
      })
    },
    setTrainInfo() {
      request({
        url: 'set_train_info',
        method: 'post',
        data: {
          trainInfo: this.trainInfo,
          beginTime: this.beginTime,
          endTime: this.endTime
        }
      }).then(response => {
        if (response.data.success) {
          this.$message.success('培训信息设置成功')
        } else {
          this.$message.error('培训信息设置失败')
        }
        this.dialogVisible = false
      })
    }
  }
}
</script>

<style scoped>
  .search-area {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .search-inputs {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .search-inputs > .el-input {
    margin-right: 10px;
  }
</style>
