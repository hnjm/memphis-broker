// Copyright 2022-2023 The Memphis.dev Authors
// Licensed under the Memphis Business Source License 1.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// Changed License: [Apache License, Version 2.0 (https://www.apache.org/licenses/LICENSE-2.0), as published by the Apache Foundation.
//
// https://github.com/memphisdev/memphis-broker/blob/master/LICENSE
//
// Additional Use Grant: You may make use of the Licensed Work (i) only as part of your own product or service, provided it is not a message broker or a message queue product or service; and (ii) provided that you do not use, provide, distribute, or make available the Licensed Work as a Service.
// A "Service" is a commercial offering, product, hosted, or managed service, that allows third parties (other than your own employees and contractors acting on your behalf) to access and/or use the Licensed Work or a substantial set of the features or functionality of the Licensed Work to third parties as a software-as-a-service, platform-as-a-service, infrastructure-as-a-service or other similar services that compete with Licensor products or services.
package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Consumer struct {
	ID                       primitive.ObjectID `json:"id" bson:"_id"`
	Name                     string             `json:"name" bson:"name"`
	StationId                primitive.ObjectID `json:"station_id" bson:"station_id"`
	Type                     string             `json:"type" bson:"type"`
	ConnectionId             primitive.ObjectID `json:"connection_id" bson:"connection_id"`
	ConsumersGroup           string             `json:"consumers_group" bson:"consumers_group"`
	MaxAckTimeMs             int64              `json:"max_ack_time_ms" bson:"max_ack_time_ms"`
	CreatedByUser            string             `json:"created_by_user" bson:"created_by_user"`
	IsActive                 bool               `json:"is_active" bson:"is_active"`
	CreationDate             time.Time          `json:"creation_date" bson:"creation_date"`
	IsDeleted                bool               `json:"is_deleted" bson:"is_deleted"`
	MaxMsgDeliveries         int                `json:"max_msg_deliveries" bson:"max_msg_deliveries"`
	StartConsumeFromSequence uint64             `json:"start_consume_from_sequence" bson:"start_consume_from_sequence"`
	LastMessages             int64              `json:"last_messages" bson:"last_messages"`
}

type ExtendedConsumer struct {
	Name             string    `json:"name" bson:"name"`
	CreatedByUser    string    `json:"created_by_user" bson:"created_by_user"`
	CreationDate     time.Time `json:"creation_date" bson:"creation_date"`
	IsActive         bool      `json:"is_active" bson:"is_active"`
	IsDeleted        bool      `json:"is_deleted" bson:"is_deleted"`
	ClientAddress    string    `json:"client_address" bson:"client_address"`
	ConsumersGroup   string    `json:"consumers_group" bson:"consumers_group"`
	MaxAckTimeMs     int64     `json:"max_ack_time_ms" bson:"max_ack_time_ms"`
	MaxMsgDeliveries int       `json:"max_msg_deliveries" bson:"max_msg_deliveries"`
	StationName      string    `json:"station_name" bson:"station_name"`
}

type Cg struct {
	Name                  string             `json:"name" bson:"name"`
	UnprocessedMessages   int                `json:"unprocessed_messages" bson:"unprocessed_messages"`
	PoisonMessages        int                `json:"poison_messages" bson:"poison_messages"`
	IsActive              bool               `json:"is_active" bson:"is_active"`
	IsDeleted             bool               `json:"is_deleted" bson:"is_deleted"`
	InProcessMessages     int                `json:"in_process_messages" bson:"in_process_messages"`
	MaxAckTimeMs          int64              `json:"max_ack_time_ms" bson:"max_ack_time_ms"`
	MaxMsgDeliveries      int                `json:"max_msg_deliveries" bson:"max_msg_deliveries"`
	ConnectedConsumers    []ExtendedConsumer `json:"connected_consumers" bson:"connected_consumers"`
	DisconnectedConsumers []ExtendedConsumer `json:"disconnected_consumers" bson:"disconnected_consumers"`
	DeletedConsumers      []ExtendedConsumer `json:"deleted_consumers" bson:"deleted_consumers"`
	LastStatusChangeDate  time.Time          `json:"last_status_change_date" bson:"last_status_change_date"`
}

type GetAllConsumersByStationSchema struct {
	StationName string `form:"station_name" binding:"required" bson:"station_name"`
}

type CreateConsumerSchema struct {
	Name             string `json:"name" binding:"required"`
	StationName      string `json:"station_name" binding:"required"`
	ConnectionId     string `json:"connection_id" binding:"required"`
	ConsumerType     string `json:"consumer_type" binding:"required"`
	ConsumersGroup   string `json:"consumers_group"`
	MaxAckTimeMs     int64  `json:"max_ack_time_ms"`
	MaxMsgDeliveries int    `json:"max_msg_deliveries"`
}

type DestroyConsumerSchema struct {
	Name        string `json:"name" binding:"required"`
	StationName string `json:"station_name" binding:"required"`
}

type CgMember struct {
	Name             string `json:"name" bson:"name"`
	ClientAddress    string `json:"client_address" bson:"client_address"`
	IsActive         bool   `json:"is_active" bson:"is_active"`
	IsDeleted        bool   `json:"is_deleted" bson:"is_deleted"`
	CreatedByUser    string `json:"created_by_user" bson:"created_by_user"`
	MaxMsgDeliveries int    `json:"max_msg_deliveries" bson:"max_msg_deliveries"`
	MaxAckTimeMs     int64  `json:"max_ack_time_ms" bson:"max_ack_time_ms"`
}
