import * as pulumi from "@pulumi/pulumi";
import * as random from "@pulumi/random";
import * as command from "@pulumi/command";

const managedObjects = false;



const syncCommandID = !managedObjects 
    ? new random.RandomUuid("local-sync-id", {}) 
    : undefined;

if (!managedObjects) {

    new command.local.Command("local-sync", {

        // How can I run this either after all managed objects are deleted (i.e., all managed "depend on" this command) OR when there aren't any objects being managed.
        // But of course, the problem is that depending on this command means the command will be CREATEd first. So that's a problem. 
        create: "touch create-$(date +%s%3).txt && sleep 3",

        // I know when to run this; this makes sense.
        update: "touch update-$(date +%s%3).txt && sleep 3",

        // How can I run this either before any managed objects are created (all managed objects "depend on" this command) OR before the bucket they rely on is destroyed?
        delete: "touch delete-$(date +%s%3).txt && sleep 3",
        
        environment: {
            last_file_updates: "some-date-news",
        },

    }, { dependsOn: syncCommandID });  
}
