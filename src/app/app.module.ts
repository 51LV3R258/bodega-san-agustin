import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//Necesario para uso de Http
import { HttpClientModule } from '@angular/common/http';
//Importar Modulo para Storage
import { IonicStorageModule } from '@ionic/storage';
import { ProductsModule } from './components/products/products.module';
@NgModule({
	declarations: [ AppComponent ],
	entryComponents: [],
	imports: [
		ProductsModule,
		IonicStorageModule.forRoot({
			name: '__bg-san-agustin',
			//IOS en prueba de navegador no esta usando indexeddb en vez de eso usa localstorage
			driverOrder: [ 'sqlite', 'indexeddb', 'localstorage', 'websql' ]
		}),
		HttpClientModule,
		BrowserModule,
		IonicModule.forRoot(),
		AppRoutingModule
	],
	providers: [
		// StatusBar,
		// SplashScreen,
		{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
	],
	bootstrap: [ AppComponent ]
})
export class AppModule {}
