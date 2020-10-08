import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// import { ToastComponent } from './toast/toast.component';
// import { Toast } from './toast/toast.service';
import { APIInterceptor } from './interceptor/APIinterceptor';
import { API_GATEWAY, BASE_URL } from './token';
//import { FetchMe } from './state/user.action';
// import { VerifycodeService } from './service/verifycode.service';
// import { ModalService } from './service/modals.service';
export interface APIOptions {
    api_gateway: string;
    base_url: string;
}



@NgModule({
    declarations: [
    ],
    imports: [
        HttpClientModule,
    ],
    exports: [
        HttpClientModule,
    ]
})
export class CoreModule {
    static forRoot(options: APIOptions): ModuleWithProviders<CoreModule> {
        return {
            ngModule: CoreModule,
            providers: [
                // Toast,
                {
                    provide: API_GATEWAY,
                    useValue: options.api_gateway
                },
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: APIInterceptor,
                    multi: true
                },
                {
                    provide: BASE_URL,
                    useValue: options.base_url
                }
                // VerifycodeService,
                // ModalService
            ]
        };
    }
}