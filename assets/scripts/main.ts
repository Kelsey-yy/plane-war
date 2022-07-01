// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {
    // 单例
    public static instance: Main = null

    // 背景音乐
    @property(cc.AudioClip)
    bgm: cc.AudioClip = null
    current_bgm = null

    // 两张背景轮播
    @property(cc.Node)
    bg1 : cc.Node = null
    @property(cc.Node)
    bg2 : cc.Node = null

    // 游戏状态：准备、暂停、开始、结束
    @property(cc.Node)
    status_ready : cc.Node = null
    @property(cc.Node)
    status_pause : cc.Node = null
    @property(cc.Node)
    status_playing : cc.Node = null
    @property(cc.Node)
    status_over : cc.Node = null

    // 飞机
    @property(cc.Node)
    hero: cc.Node = null
    
    // 子弹
    @property(cc.Prefab)
    bulletPerfab: cc.Node = null
    bulletPool: NodePool = null // 子弹集合
    bulletCount: number = 0

     // 敌机1
     @property(cc.Prefab)
     enemy1Perfab: cc.Node = null
     enemy1Pool: NodePool = null // 敌机集合
     enemy1Count: number = 0

     // 敌机3
     @property(cc.Prefab)
     enemy3Perfab: cc.Prefab = null
     enemy3Pool: NodePool = null
     enemy3Count: number = 0

    // 计分
    @property(cc.Label)
    scoreLabel: cc.Label = null
    score: number = 0

    // 游戏结束
    @property(cc.Label)
    finalLabel: cc.Label
    // finalScore: number = null

    isHeroDie: boolean = false

    onLoad () {

        // 参数：当前音乐、 是否loop、 音量
        this.current_bgm = cc.audioEngine.play(this.bgm, true, 1);

        // 开启碰撞检测
        const manager = cc.director.getCollisionManager()
        manager.enabled = true;
        // Main实例
        if (Main.instance == null) {
            Main.instance = this
        } else {
            this.destroy()
            return
        }

        // 初始化子弹对象
        this.bulletPool = new cc.NodePool()
        // 初始化敌军对象1
        this.enemy1Pool = new cc.NodePool()
         // 初始化敌军对象3
         this.enemy3Pool = new cc.NodePool()

        // 游戏初始状态设置
        this.status_ready.active = true
        this.status_pause.active = false
        this.status_playing.active = false
        this.status_pause.zIndex = 2
        // 游戏背景初始化
        this.bg1.y = 0
        this.bg2.y = this.bg1.height
        // 注册触摸屏幕事件
        this.setTouch()


    }

    start () {

    }

    // 每一帧调用
    update (dt) {
        if (this.status_playing.active) {
            // 背景轮播
            this.bgMove()
            // 子弹创建
            this.bulletCount++
            if (this.bulletCount >= 5) { // 子弹创建不需要太密集
                this.createBullet()
                this.bulletCount = 0
            }
            // 创建敌机1
            this.enemy1Count++
            if (this.enemy1Count >= 10) {
                this.createEnemy1()
                this.enemy1Count = 0
            }

            // 创建敌机3
            this.enemy3Count++
            if (this.enemy3Count >= 50) {
                this.createEnemy3()
                this.enemy3Count = 0
            }
        }

        this.scoreLabel.string = this.score.toString()
        // console.log(this.node.childrenCount)


    }

    // 背景轮播
    bgMove() {
        this.bg1.y -= 8
        this.bg2.y -= 8
        if (this.bg1.y <= -this.bg1.height) {
            this.bg1.y =this.bg2.y + this.bg1.height
        }

        if (this.bg2.y <= -this.bg2.height) {
            this.bg2.y =this.bg1.y + this.bg2.height
        }
    }

    // 设置触摸事件
    setTouch() {
        this.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            // console.log('玩家点击了屏幕')
            this.status_ready.active = false
            this.status_playing.active = true
        },this)

        this.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {
            // console.log('玩家移动手指')
            // 获取触点距离上一次移动的距离（学会看文档，文档很清晰呀！）
            const pos = event.getDelta()
            this.hero.setPosition(cc.v2(this.hero.x + pos.x, this.hero.y + pos.y))
        })

        this.node.on(cc.Node.EventType.TOUCH_END, (event) => {
            // console.log('玩家结束触摸')
        })
    }

    // 点击按钮： 暂停、继续游戏、重新开始、回到主页
    btnClick(sender, msg) {
        // 后面可以用switch  case来替代
        // console.log(sender, msg)
        if (msg === 'pause') {
            this.status_playing.active = false
            this.status_pause.active = true
            cc.audioEngine.stop(this.current_bgm)
        } else if (msg === 'continue') {
            this.status_pause.active = false
            this.status_playing.active = true
        this.current_bgm = cc.audioEngine.play(this.bgm, true, 1);
        } else if (msg === 'restart') {
            this.status_pause.active = false
            this.status_playing.active = true
            this.current_bgm = cc.audioEngine.play(this.bgm, true, 1);
            this.cleanAllEnemies()
            this.cleanAllBullets()
            this.score = 0

        } else if (msg === 'back') {
            this.status_pause.active = false
            this.status_ready.active = true
            this.status_over.active = false
            this.current_bgm = cc.audioEngine.play(this.bgm, true, 1);
            this.cleanAllEnemies()
            this.cleanAllBullets()
            this.hero.x = 0
            this.hero.y = -350

            this.score = 0
            // 回到主页飞机变正常
            this.isHeroDie = false
            this.hero.active = true
            const anim = this.hero.getComponent(cc.Animation)
            anim.play('hero_normal')
        }
    }

    // 游戏结束
    gameOver(){
        this.isHeroDie = true
        const anim = this.hero.getComponent(cc.Animation)
        anim.play('hero_die')
        this.status_playing.active = false
        this.status_over.active = true
        this.finalLabel.string = '最终得分：' + this.score.toString()

        // 停止bgm
        cc.audioEngine.stop(this.current_bgm)


    }

    // hero死亡的回调
    heroOver() {
        this.hero.active = false
    }

    // 创建子弹
    createBullet() {
        let bullet = null
        // bulletPool中有子弹则直接取，没有则创建
        if (this.bulletPool.size() > 0) {
            bullet = this.bulletPool.get()
        } else {
            bullet = cc.instantiate(this.bulletPerfab)
        }
        // 将子弹挂到canvas上
        bullet.setParent(this.node)
        // 设置子弹坐标
        bullet.setPosition(cc.v2(this.hero.x, this.hero.y + this.hero.height / 2))
    }

    // 销毁子弹： 回收子弹放进bulletPool中重复利用
    bulletKilled(bullet) {
        this.bulletPool.put(bullet)
    }

    // 重新开始、回到主页要回收所以的子弹
    cleanAllBullets() {
        const children = this.node.children
        // 子弹相比所有的子元素，是最后挂载到canvas上的，所以我们从后往前遍历去清除子弹
        for (let i = children.length - 1; i >= 0; i--) {
            // 判断该子节点是否是子弹：直接判断该子节点是否是bullet component
            if (children[i].getComponent('bullet')) {
                this.bulletKilled(children[i]) // 回收子弹
            }
        }
    }


    createEnemy1() {
        let enemy1 = null
        if (this.enemy1Pool.size() > 0) {
            enemy1 = this.enemy1Pool.get()
        } else {
            enemy1 = cc.instantiate(this.enemy1Perfab)
        }
        // 将敌军挂到canvas上
        enemy1.setParent(this.node)
        // 设置敌军x坐标：随机在 -295~295 之间
        const randomX = 295 - Math.random() * 590
        enemy1.setPosition(cc.v2(randomX, 600))


        /* 
        创建的时候要初始化：播放正常的敌军状态，因为回收飞机的时候并不是销毁了，
        而是放进enemy1Pool中，所以从enemy1Pool中拿的敌军不会重新走enemy1中的onLoad方法
         */
        let script = enemy1.getComponent('enemy1')
        if (script) {
            script.init()
        }
    }

    // 回收飞机
    enemy1Killed(enemy1) {
        this.enemy1Pool.put(enemy1)
    }

     // 重新开始、回到主页要回收所有的敌机
     cleanAllEnemies() {
        const children = this.node.children
        for (let i = children.length - 1; i >= 0; i--) {
            if (children[i].getComponent('enemy1') || children[i].getComponent('enemy3')) {
                this.enemy1Killed(children[i]) // 回收敌机
            }
        }
    }

    createEnemy3() {
        let enemy3 = null
        if (this.enemy3Pool.size() > 0) {
            enemy3 = this.enemy3Pool.get()
        } else {
            enemy3 = cc.instantiate(this.enemy3Perfab)
        }
        // 将敌军挂到canvas上
        enemy3.setParent(this.node)
        // 设置敌军x坐标：随机在 -295~295 之间
        const randomX = 295 - Math.random() * 590
        enemy3.setPosition(cc.v2(randomX, 700))


        /* 
        创建的时候要初始化：播放正常的敌军状态，因为回收飞机的时候并不是销毁了，
        而是放进enemy1Pool中，所以从enemy1Pool中拿的敌军不会重新走enemy1中的onLoad方法
         */
        const script = enemy3.getComponent('enemy3')
        if (script) {
            script.init()
        }
    }

    enemy3Killed(enemy3) {
        this.enemy3Pool.put(enemy3)
    }

}
