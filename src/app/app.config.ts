import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Injectable()
export class AppConfig {

    private config: Object = null;
    private environment:    Object = null;

    constructor(private http: HttpClient, public router: Router, private titleService: Title) {

    }

    /**
     * Use to get the data found in the second file (config file)
     */
    public getConfig(key: any) {
        return this.config[key];
    }

    /**
     * Use to get the data found in the first file (environment file)
     */
    public getEnv(key: any) {
        try {
            return this.environment[key];
        }
        catch(err) {
            this.router.navigate(['install'])
          }
    }

    /**
     * This method:
     *   a) Loads "environment.json" to get the current working environment (e.g.: 'production', 'development')
     *   b) Loads "config.[environment].json" to get all environment's variables (e.g.: 'config.development.json')
     */
    public load() {
        return new Promise((resolve, reject) => {
            this.http.get('/assets/config/config.json').subscribe((envResponse) => {
                this.environment= envResponse;
                let request:any = null;

                switch (envResponse['environment']) {
                    case 'production': {
                        console.log("in production")
                        request = this.http.get('/assets/config/config.json');
                    } break;

                    case 'development': {
                        console.log("in development")
                        request = this.http.get('/assets/config/config.json');
                    } break;

                    case 'default': {
                        console.error('environment is not set or invalid in config.json file');
                        this.router.navigate(['install'])
                        resolve(true);
                    } break;
                }

                if (request) {
                    request
                        .subscribe((responseData) => {
                            this.config = responseData;
                            this.titleService.setTitle(responseData.title);
                            resolve(true);
                        }, err => {console.log('Error reading config.json configuration file', err);
                        this.titleService.setTitle("Sunbird RC");
                        this.router.navigate(['install'])});
                } else {
                    console.error('config.json file is not valid');
                    this.titleService.setTitle("Sunbird RC");
                    this.router.navigate(['install'])
                    resolve(true);
                }
            }, 
            
            err => {console.log('Error reading config.json configuration file', err);
                    this.titleService.setTitle("Sunbird RC");
                    this.router.navigate(['install'])
                    resolve(true);
                    }
            );

        });
    }
}