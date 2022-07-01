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


    @property(cc.Label)
    label: cc.Label = null;

    @property
    text: string = 'hello';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    update (dt) {
        if (Main.instance.status_playing.active) {
            this.node.y += 10
            if (this.node.y > 600) {
                Main.instance.bulletKilled(this.node)
            }
        }
    }
    
    onCollisionEnter(other, self) {
        // console.log('子弹打中了')
        // 子弹打中敌机，回收子弹
        if(self.tag === 1) {
            Main.instance.bulletKilled(this.node)
        }

        // 子弹打中敌机1，回收飞机
        if (other.tag === 2) {
            const enemy1 = other.getComponent('enemy1')
            if (enemy1) {
                enemy1.hit()
            }
            // 碰撞之后如果敌机没死，才回收子弹，敌机若死了不回收
            if (!enemy1.isDie) {
                Main.instance.bulletKilled(this.node)
            }
        }

        // 子弹打中敌机3，回收飞机
        if (other.tag === 3) {
            const enemy3 = other.getComponent('enemy3')
            if (enemy3) {
                enemy3.hit()
            }
            if (!enemy3.isDie) {
                Main.instance.bulletKilled(this.node)
            }
        }
    }
}
