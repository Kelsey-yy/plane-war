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

    onCollisionEnter(other, self) {
        const isHeroDie = Main.instance.isHeroDie
        if (self.tag === 4 && !isHeroDie) {
        //    console.log('撞上敌机')
            // 撞上敌机游戏停止
            Main.instance.gameOver()
            // 播放音效
            cc.audioEngine.play(this.sound, false, 1)
       }
        
    }


}
