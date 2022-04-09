<template>
    <div>
        <el-card show="alway" style="margin:10px">
            <!-- 头部 -->
            <div slot="header">
                <el-button type="primary" class="btn">切换</el-button>
                <el-select v-model="select" clearable @change="show" placeholder="请选择" class="select" >
                    <el-option
                    v-for="(item,index) in options"
                    :key="index"
                    :label="item.value"
                    :value="item.value">
                    </el-option>
                </el-select>
                <!-- <el-input style="display: inline-block;width:180px;margin-left:60%"></el-input>
                <el-button type="primary" style="margin-left: 20px" @click="searchFilter">搜 索</el-button> -->
            </div>
            <!-- 主题，数据展示 -->
            <Game v-show="active == 1"></Game>
            <Field v-show="active == 2"></Field>
            <Equip v-show="active == 3"></Equip>
        </el-card>
    </div>
    
</template>

<script>
import Game from './game.vue'
import Equip from './equip.vue'
import Field from './field.vue'
export default {
    name: 'Myapply',

    data() {
        return {
            active:1,
            options: [{
                value: '活动',
                }, {
                value: '场地',
                }, {
                value: '器材',
                }],
            search:'',
            select:'活动'
        };
    },
    components: {
        Game,Equip,Field
    },

    mounted() {
        
    },
    computed:{
        
    },

    methods: {
        // 切换展示内容
        show(){
            switch (this.select) {
                case '活动':
                    this.active = 1
                    break;
                case '场地':
                    this.active = 2
                    break;
                case '器材':
                    this.active = 3
                    break;
            
                default:
                    this.active = 1
                    break;
            }
        },
        // 模糊查询
        // searchFilter(){
        //     alert('该功能待开发')
        //     // this.myApply = this.myApply.filter(item => {
        //     //     if (item.contest_name == this.select || item.position == this.select || item.app_time == this.select || item.app_status == this.select) {
                    
        //     //     }
        //     // })
        // }
    },
};
</script>

<style scoped>
.select{
    display: inline-block;
    width:120px;
    
}
.select /deep/ .el-input__inner{
    border-radius: 0 5px 5px 0!important; 
}
.btn{
    margin-left: 15%;
    border-radius: 5px 0 0 5px;
}
</style>