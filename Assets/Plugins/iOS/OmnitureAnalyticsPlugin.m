#import <UIKit/UIKit.h>
#import "UnityAppController.h"
#import "UI/UnityView.h"

#import "ADBMobile.h"
#import "CSComScore.h"

@interface OmnitureAnalyticsPlugin : UnityAppController
{
}
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions;
@end

@implementation OmnitureAnalyticsPlugin

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
	[super application:application didFinishLaunchingWithOptions:launchOptions];
	
	NSString *sdkVersion = [NSString stringWithFormat:@"%@:%@:%@",
							[ADBMobile version],
							[[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleVersion"],
							[[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"]];
	
	// Including appName and sdkVersion with Lifecycle Calls
	NSMutableDictionary *contextData = [NSMutableDictionary dictionary];
	
	[contextData setObject:@"PeterPanic" forKey:@"appname"];
	[contextData setObject:sdkVersion forKey:@"sdkversion"];
	
	[ADBMobile collectLifecycleDataWithAdditionalData:contextData];
	
	// Init ComScore
	[CSComScore setAppContext];
    [CSComScore setSecure:NO];
	[CSComScore setAppName:@"PeterPanic"];
	[CSComScore setCustomerC2:@"6035748"];
	[CSComScore setPublisherSecret:@"6bba25a9ff38cd173c1c93842c768e28"];
	
	return YES;
}

@end

IMPL_APP_CONTROLLER_SUBCLASS(OmnitureAnalyticsPlugin)


// Track custom app states and event(s)
// This function accepts dictionary items in a JSON dictionary for
// easier sending and marshaling from Unity to plugin.
//
// Please note, if your application logic is written in an MM file, you will need
// to export these methods as "C" style structures.

void _trackState( const char * appState, const char * jsonDict )
{
	// Make sure we have a legit dictionary
	NSError *error = [NSError alloc];
	NSString *jsonString = [[NSString alloc] initWithUTF8String:jsonDict];
	NSMutableDictionary *contextData = [NSJSONSerialization JSONObjectWithData: [jsonString dataUsingEncoding:NSUTF8StringEncoding]  options: NSJSONReadingMutableContainers error: &error];
	
	if( ![contextData isKindOfClass:[NSMutableDictionary class]] )
		return;
	
	// Map special variables
	if ( [contextData objectForKey:@"Products"] )
		[contextData setObject:[contextData objectForKey:@"Products"] forKey:@"&&products"];
	
	// Send event
	NSString *appStateString = [[NSString alloc] initWithUTF8String:appState];
	
	[ADBMobile trackState:appStateString data:contextData];
	
}

void _trackAction( const char * eventName, const char * jsonDict )
{
	// Make sure we have a legit dictionary
	NSError *error = [NSError alloc];
	NSString *jsonString = [[NSString alloc] initWithUTF8String:jsonDict];
	NSMutableDictionary *contextData = [NSJSONSerialization JSONObjectWithData: [jsonString dataUsingEncoding:NSUTF8StringEncoding]  options: NSJSONReadingMutableContainers error: &error];
	
	if( ![contextData isKindOfClass:[NSMutableDictionary class]] )
		return;
	
	// Map special variables
	if ( [contextData objectForKey:@"Products"] )
		[contextData setObject:[contextData objectForKey:@"Products"] forKey:@"&&products"];
	
	// Send event
	NSString *events = [[NSString alloc] initWithUTF8String:eventName];
	
	[ADBMobile trackAction:events data:contextData];
}
