// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { EventType } from "../MyEvent/EventType";
import MyEvent from "../MyEvent/MyEvent";
import LoadBundleData from "./LoadBundleData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class LoadBundleManager extends cc.Component {


    public static BundleName: string = '';

    /**加载bundle */
    public static LoadBundle(callback?: Function) {
        cc.assetManager.loadBundle(`/assets/Bundles/${this.BundleName}`, (err, bundle) => {
            if (err || !bundle) return;
            LoadBundleData.assetsBundle = bundle;
            this.LoadPrefabsInBundleAssets();
            callback && callback();
            MyEvent.emit(EventType.LoadBundleOver, bundle);
        });
    }

    /**加载Bundle中的prefabs文件夹中的资源 */
    public static LoadPrefabsInBundleAssets() {
        LoadBundleData.assetsBundle.loadDir('prefabs', (err, res) => {
            if (err) return;
            res.forEach(prefab => {
                let p: any = prefab;
                LoadBundleData.prefabs.set(prefab.name, p);
            });
            MyEvent.emit(EventType.LoadBundlePrefabsOver,  LoadBundleData.prefabs);
        })
    }



}
