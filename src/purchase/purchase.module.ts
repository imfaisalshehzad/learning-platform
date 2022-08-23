import {Module} from '@nestjs/common';
import {PurchaseService} from './purchase.service';
import {PurchaseController} from './purchase.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {HttpModule} from "@nestjs/axios";

@Module({
    imports: [HttpModule],
    controllers: [PurchaseController],
    providers: [PurchaseService]
})
export class PurchaseModule {
}
