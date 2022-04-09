<template>
    <div>
        <el-table :data="myApply" style="width: 100%; margin: 10px" stripe :default-sort = "{prop: 'apptime', order: 'descending'}">
            <el-table-column
                type="index"
                label="序号"
                width="80"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="gamename"
                label="活动名称"
                width="width"
                align="center"
            >
            </el-table-column>
            <el-table-column
                prop="activityType"
                label="活动类型"
                width="width"
                align="center"
            >
            </el-table-column>
            <!-- <el-table-column
                prop="gametime"
                label="活动时间"
                width="width"
                align="center"
                sortable
            >
            </el-table-column> -->
            <el-table-column
                prop="apptime"
                label="申请时间"
                width="width"
                align="center"
                sortable
            >
            </el-table-column>
            <el-table-column
                prop="status"
                label="审批状态"
                width="width"
                align="center"
            >
                <template slot-scope="{row}">
                    <el-tag type="info" v-if="row.status == 0"
                        >审核中</el-tag
                    >
                    <el-tag type="success" v-if="row.status == 1"
                        >通过</el-tag
                    >
                    <el-tag type="danger" v-if="row.status == 2"
                        >驳回</el-tag
                    >
                    <el-tag type="warning" v-if="row.status == 3"
                        >取消申请</el-tag
                    >
                </template>
            </el-table-column>
            <el-table-column prop="prop" label="操作" width="width">
                <template slot-scope="{ row }">
                    <el-button type="warning" v-if="row.status == 0" @click="cancel(row)">取消申请</el-button >
                    <el-button type="info" @click="exhibition(row)">查看详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination
            :currentPage="currentPage"
            :total="total"
            :limit="limit"
            :page-sizes='pageSizes'
            @handleCurrentChange="handleCurrentChange"
            @handleSizeChange="handleSizeChange"
        />
        <el-dialog title="详情页" :model="showlist" :visible.sync="isShow" class="dialog">
            <el-form label-position="rigth" label-width="180px" class="form">
                <el-form-item label="活动名称:">
                    <span><b><h3>{{showlist.gamename}}</h3></b></span>
                </el-form-item>
                <el-form-item label="活动类型:">
                    <span><b><h3>{{showlist.activityType}}</h3></b></span>
                </el-form-item>
                <el-form-item label="活动时间:">
                    <span><b><h3>{{showlist.gametime}}</h3></b></span>
                </el-form-item>
                <el-form-item label="活动描述:">
                    <span><b><h3>{{showlist.description}}</h3></b></span>
                </el-form-item>
                <el-form-item label="申请时间:">
                    <span><b><h3>{{showlist.apptime}}</h3></b></span>
                </el-form-item>
                <el-form-item label="审批号:" v-if="showlist.code" >
                <span><b><h3>{{showlist.code}}</h3></b></span>
                </el-form-item>
                <el-form-item label="申请状态">
                    <el-radio-group v-model="showlist.status" size="medium" disabled >
                        <el-radio label=1 size="medium">通过</el-radio>
                        <el-radio label=0 size="medium">审核中</el-radio>
                        <el-radio label=2 size="medium">驳回</el-radio>
                        <el-radio label=3 size="medium">取消申请</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" @click="isShow = false">返 回</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    name: "Game",

    data() {
        return {
            isShow: false,
            myApply: [],
            showlist: {},
            currentPage: 1,
            limit: 5,
            total: 0,
            pageSizes:[5,10,15,20]
        };
    },

    mounted() {
        this.getGameApplyInfo();
    },

    methods: {
        // 获取用户申请数据
        async getGameApplyInfo() {
            // console.log(111)
            const uid = this.$store.state.user.uid;
            // console.log(uid)
            let result = await this.$store.dispatch("getGameApply", uid);
            // console.log(result)
            if (result.message) {
                this.$message.error(result.message);
            } else {
                this.myApply = result.slice(
                    (this.currentPage - 1) * this.limit,
                    this.limit * this.currentPage
                );
                this.total = result.length;
                // console.log(this.currentPage,(this.currentPage-1)*this.limit,this.limit,this.myApply)
                this.myApply.forEach((item) => {
                    item.gametime = this.$moment(item.gametime).format(
                        "YYYY-MM-DD HH:mm:ss"
                    );
                    item.apptime = this.$moment(item.apptime).format(
                        "YYYY-MM-DD HH:mm:ss"
                    );
                });
            }
        },
        // 展示指定申请的详情
        exhibition(row) {
            this.showlist = row;
            this.isShow = true;
            // console.log(row)
        },

        // 取消申请
        cancel(row) {
            this.$comfirm('请确认取消该条申请','提示',{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async ()=>{
                const result = await this.$store.dispatch("cancel", {
                    gid: row.gid,
                });
                if ((result.code = 200)) {
                    // 取消成功重新获取数据
                    this.getGameApplyInfo();
                    this.$notify.success({
                        title: "成功",
                        message: "取消成功",
                    });
                    this.getGameApplyInfo()
                } else {
                    this.$notify.error({
                        title: "失败",
                        message: "取消失败",
                    });
                }
            })
            
        },

        // 分页器
        handleCurrentChange(val) {
            this.currentPage = val;
            this.getGameApplyInfo();
        },
        handleSizeChange(val) {
            this.limit = val;
            this.currentPage = 1;
            this.getGameApplyInfo();
        },
    },
};
</script>

<style lang="scss" scoped>
.form {
    width: 480px;
    position: relative;
    left: 50%;
    margin-left: -225px;
    top: 40%;
}
.el-radio {
    color: #000000;
    margin-right: 0px;
}
h3{
    margin: 0;
    color: rgb(4, 28, 248);
}
</style>
<style scoped>
.form /deep/ .el-radio {
    /* color: #574e4e!important; */
    margin-right: 5px !important;
}
.form /deep/ .el-radio__input.is-disabled + span.el-radio__label {
    /* color: #574e4e!important; */
    /* font-size: 16px!important; */
    font-weight: bold !important;
}
.form /deep/ .el-radio__input.is-checked + .el-radio__label {
    color: rgb(55, 0, 255) !important;
}
</style>
