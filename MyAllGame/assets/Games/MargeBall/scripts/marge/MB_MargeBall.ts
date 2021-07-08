// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class MB_MargeBall extends cc.Component {

    public col: cc.PhysicsCircleCollider = null;
    public rig: cc.RigidBody = null;
    onEnable() {
        this.init();
    }
    init() {
        this.col = this.node.getComponent(cc.PhysicsCircleCollider);
        this.rig = this.node.getComponent(cc.RigidBody);
        // this.node.on()
    }
    /**开启重力 */
    openGravity() {
        this.col.sensor = false;
        this.rig.gravityScale = 1;
    }
    /**开启重力 */
    closeGravity() {
        this.col.sensor = true;
        this.rig.gravityScale = 0;
    }
    
}
