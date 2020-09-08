import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { MineLoraGatewaysComponent } from './views/administration-gateway/mine-lora-gateways/mine-lora-gateways.component';
import { ListLoraGatewayComponent } from './views/administration-gateway/list-lora-gateway/list-lora-gateway.component';
import { EditGatewayComponent } from './views/administration-gateway/edit-gateway/edit-gateway.component';
import { GatewayComponent } from './views/administration-gateway/gateway/gateway.component';
import { DatatargetListComponent } from './views/datatarget/datatarget-list/datatarget-list.component';

const routes: Routes = [

    { path: 'my-applications', loadChildren: () => import('./my-applications/my-applications.module').then(m => m.MyApplicationsModule) },

    {
        path: 'mine-lora-gateways', component: MineLoraGatewaysComponent,
        children: [
            { path: '', component: ListLoraGatewayComponent },
            { path: 'edit-gateway/:id', component: EditGatewayComponent },
            { path: 'edit-gateway', component: EditGatewayComponent },
            { path: 'gateway/:id', component: GatewayComponent }
        ],

    },
    { path: 'datatarget', component: DatatargetListComponent },
    { path: 'profiles', loadChildren: () => import('./profiles/profiles.module').then(m => m.ProfilesModule) },
    { path: '', redirectTo: '/profiles', pathMatch: 'full' },
    { path: '**', redirectTo: '/profiles', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
    exports: [RouterModule],
})
export class AppRoutingModule { }
