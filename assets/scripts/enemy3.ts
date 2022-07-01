// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;
import Main from './main'
@ccclass
export default class NewClass extends cc.Component {

    @property(cc.AudioClip)
    sound: cc.AudioClip = null

    isDie:boolean = false
    blood: number = 5

    onLoad () {
        this.init()
    }

    start () {

    }

    // 初始化敌军是正常状态
    init() {
        this.isDie = false
        this.blood = 5
        const anim = this.getComponent(cc.Animation)
        anim.play('enemy3_normal')
    }

    update (dt) {
        if (Main.instance.status_playing.active) {
            this.node.y -= 1
        }
    }

    hit() {
        if (!this.isDie) {
            // 每次击中减一滴血
            this.blood -= 1
            // 之后播放击中的动画
            const anim = this.getComponent(cc.Animation)
            anim.play('enemy3_hit')
            // 被打中播放音效
            cc.audioEngine.play(this.sound, false, 1);
            // 判断血量
            if (this.blood <= 0) {
                anim.play('enemy3_die')
                this.isDie = true
                // 得分
                Main.instance.score += 500
            }


        }
    }
    
    // hitOver() {
    //     // 播放完被击中的动画

    // }

    die() {
        // 播放完死亡动画回收
        Main.instance.enemy3Killed(this.node)
    }

}
