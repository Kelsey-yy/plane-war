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

    isDie: boolean = false

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.init()
    }

    start () {

    }

    // 初始化敌军是正常状态
    init() {
        this.isDie = false
        const anim = this.getComponent(cc.Animation)
        anim.play('enemy1_normal')
    }

    update (dt) {
        if (Main.instance.status_playing.active) {
            this.node.y -= 3
        }
        // if (this.node.y <= -630) {
        //     Main.instance.enemy1Killed(this.node)
        // }
    }

    hit() {
        if (!this.isDie) {
            this.isDie = true
            const anim = this.getComponent(cc.Animation)
            anim.play('enemy1_die')
            cc.audioEngine.play(this.sound, false, 1);
            // 飞机被打中分数加100
            Main.instance.score += 100
        }
    }

    // 内置事件：动画播放完之后的回调
    die() {
        Main.instance.enemy1Killed(this.node)
    }
}
