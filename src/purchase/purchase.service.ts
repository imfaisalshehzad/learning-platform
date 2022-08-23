import {HttpStatus, HttpException, Injectable} from '@nestjs/common';
import {ConfigService} from "@nestjs/config";
import {HttpService} from "@nestjs/axios";
import {lastValueFrom} from "rxjs";
import ShortUniqueId from "short-unique-id";
import {UpdateSessionPayPurchaseDto} from "./dto/update-session-purchase.dto";


@Injectable()
export class PurchaseService {

    constructor(
        private readonly configService: ConfigService,
        private readonly httpService: HttpService,
    ) {}

    public masterCardMerchant = this.configService.get('MASTERCARD_MERCHANT');
    public masterCardPassword = this.configService.get('MASTERCARD_PASSWORD');
    public masterCardBaseUrl = this.configService.get('MASTERCARD_BASE_URL');
    public masterCardMid = this.configService.get('MASTERCARD_MID');
    public masterCardCurrency = this.configService.get('MASTERCARD_CURRENCY');
    public masterCardApiOperation = this.configService.get('MASTERCARD_API_OPERATION');
    public headersRequest = {
        Authorization: `Basic ${Buffer.from(`${this.masterCardMerchant}:${this.masterCardPassword}`).toString('base64')}`,
    }

    async updateSession(sessionId: string, json: UpdateSessionPayPurchaseDto, order: string, transaction: string, ) {

        const masterCardSessionURL = `${this.masterCardBaseUrl}/merchant/${this.masterCardMid}/session/${sessionId}`;
        const headersRequestValue = this.headersRequest;
        const masterCardAPIJson = {
            order: {
                id: order,
                amount: json.order_amount,
                currency: `${this.masterCardCurrency}`
            },
            transaction: {
                id: transaction,
                amount: json.order_amount,
                currency: `${this.masterCardCurrency}`
            },
        }
        const res = await lastValueFrom(this.httpService
            .put(
                masterCardSessionURL,
                masterCardAPIJson,
                {headers: headersRequestValue}
            ))
            .then(function (data) {
                if (data?.data?.session?.updateStatus !== "SUCCESS") {
                    throw new HttpException('Enable to update session. ', HttpStatus.BAD_REQUEST)
                }
                return data.data;
            })
            .catch(function (err) {
                throw new HttpException('Enable to update session. ' + err, HttpStatus.BAD_REQUEST)
            });

        return res;
    }

    async createPaymentSession() {

        const sessionUrl = `${this.masterCardBaseUrl}/merchant/${this.masterCardMid}/session`;
        const res = await lastValueFrom(this.httpService.post(sessionUrl, '', {headers: this.headersRequest}))
            .then(function (data) {
                return data.data;
            })
            .catch(function (err) {
                throw new HttpException('Enable to create session.', HttpStatus.BAD_REQUEST)
            });

        return res;

    }

    async createAndUpdateSession(updateSessionPayPurchaseDto: UpdateSessionPayPurchaseDto) {

        const uid = new ShortUniqueId({ length: 10 });
        const orderUID = uid();
        const transactionUID = uid();

        const masterCardSession = await this.createPaymentSession();
        const sessionId = masterCardSession?.session?.id;
        return await this.updateSession(sessionId, updateSessionPayPurchaseDto, orderUID, transactionUID);;

    }


}
