import UIKit
import TVMLKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate, TVApplicationControllerDelegate {
    var window: UIWindow?
    var appController: TVApplicationController?
    
    static let TVBaseURL = "http://localhost:9001/"
    static let TVBootURL = "\(AppDelegate.TVBaseURL)dist/application.js"
    
    func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
        window = UIWindow(frame: UIScreen.mainScreen().bounds)
        
        let appControllerContext = TVApplicationControllerContext()

        if let javaScriptURL = NSURL(string: AppDelegate.TVBootURL) {
            appControllerContext.javaScriptApplicationURL = javaScriptURL
        }
        
        appControllerContext.launchOptions["TVBaseURL"] = AppDelegate.TVBaseURL
        
        if let launchOptions = launchOptions as? [String: AnyObject] {
            for (kind, value) in launchOptions {
                appControllerContext.launchOptions[kind] = value
            }
        }
        
        appController = TVApplicationController(context: appControllerContext, window: window, delegate: self)
        
        return true
    }
    
    func appController(appController: TVApplicationController, didFinishLaunchingWithOptions options: [String: AnyObject]?) {
        // print("\(__FUNCTION__) invoked with options: \(options)")
    }
    
    func appController(appController: TVApplicationController, didFailWithError error: NSError) {
        print("\(__FUNCTION__) invoked with error: \(error)")
        
        let title = "Error Launching Application"
        let message = error.localizedDescription
        let alertController = UIAlertController(title: title, message: message, preferredStyle:.Alert )
        
        self.appController?.navigationController.presentViewController(alertController, animated: true, completion: { () -> Void in
            // ...
        })
    }
    
    func appController(appController: TVApplicationController, didStopWithOptions options: [String: AnyObject]?) {
        // print("\(__FUNCTION__) invoked with options: \(options)")
    }
}